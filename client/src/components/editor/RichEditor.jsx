import React, { useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style';
import noteService from '../../services/noteService';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Minus, Undo2, Redo2, ImageIcon, LinkIcon, Unlink,
  Loader2, Trash2, Maximize2
} from 'lucide-react';

const FONT_SIZES = [
  { label: '8', value: '8px' }, { label: '10', value: '10px' },
  { label: '12', value: '12px' }, { label: '14', value: '14px' },
  { label: '16', value: '16px' }, { label: '18', value: '18px' },
  { label: '20', value: '20px' }, { label: '24', value: '24px' },
  { label: '28', value: '28px' }, { label: '32', value: '32px' },
  { label: '36', value: '36px' }, { label: '48', value: '48px' },
  { label: '64', value: '64px' },
];

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Sans-Serif', value: 'Outfit, "Helvetica Neue", Arial, sans-serif' },
  { label: 'Monospace', value: '"Space Mono", "Courier New", monospace' },
  { label: 'Display', value: 'Outfit, sans-serif' },
  { label: 'Handwriting', value: '"Caveat", "Comic Sans MS", cursive' },
  { label: 'Playfair', value: '"Playfair Display", Georgia, serif' },
  { label: 'Merriweather', value: 'Merriweather, Georgia, serif' },
];

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-all duration-150 ${
      active
        ? 'bg-amber/20 text-amber shadow-sm shadow-amber/10'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:scale-95'
    }`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="w-px h-5 bg-[var(--border-color)] mx-0.5 opacity-50" />
);

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const RichEditor = ({ content, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [pasteDetected, setPasteDetected] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState('');
  const uploadingRef = useRef(false);
  const fileInputRef = useRef(null);
  const insertLockRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false, underline: false, gapcursor: false }),
      Underline,
      TextStyle,
      FontSize.configure({ types: ['textStyle'] }),
      FontFamily.configure({ types: ['textStyle'] }),
      Image.extend({
        addAttributes() {
          return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: { default: null },
            height: { default: null },
            dataAlign: { default: null },
          }
        },
        renderHTML({ HTMLAttributes }) {
          const { dataAlign, ...attrs } = HTMLAttributes;
          let style = 'display: block; max-width: 100%; height: auto;';
          if (dataAlign === 'center') style = 'display: block; margin-left: auto; margin-right: auto; max-width: 100%; height: auto;';
          else if (dataAlign === 'right') style = 'display: block; margin-left: auto; margin-right: 0; max-width: 100%; height: auto;';
          else if (dataAlign === 'left') style = 'display: block; margin-right: auto; margin-left: 0; max-width: 100%; height: auto;';
          return ['img', { ...attrs, style }];
        },
        parseHTML() {
          return [{ tag: 'img[data-align]' }];
        },
      }).configure({ inline: false, allowBase64: true }),
      LinkExtension.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { class: 'text-amber underline decoration-1 underline-offset-2', target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
      handlePaste: () => false,
      handleClick: () => false,
    },
  });

  const insertImage = useRef(async (url) => {
    if (insertLockRef.current) return;
    insertLockRef.current = true;
    try {
      const inserted = editor.chain().focus().setImage({ src: url }).run();
      if (!inserted) {
        console.warn('[InsertImage] setImage command returned false, trying insertContent...');
        editor.commands.insertContent(`<img src="${url}" />`);
      }
    } catch (e) {
      console.error('[InsertImage] Failed:', e.message);
    }
    insertLockRef.current = false;
  });

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    if (!dom) return;

    const onPasteCapture = async (event) => {
      try {
        if (!event.clipboardData) {
          console.warn('[Paste] No clipboardData available (event type:', event.type, ')');
          return;
        }

        const cb = event.clipboardData;
        console.log('[Paste] clipboardData types:', cb.types);
        console.log('[Paste] clipboardData files length:', cb.files?.length);
        console.log('[Paste] clipboardData items length:', cb.items?.length);

        let imageFile = null;

        if (cb.files?.length > 0) {
          imageFile = Array.from(cb.files).find(f => f.type.startsWith('image/'));
          console.log('[Paste] Found from files:', imageFile?.name, imageFile?.type);
        }
        if (!imageFile && cb.items?.length > 0) {
          const items = Array.from(cb.items);
          const item = items.find(i => i.type.startsWith('image/'));
          imageFile = item?.getAsFile?.() || null;
          console.log('[Paste] Found from items:', imageFile?.name, imageFile?.type);
        }
        if (!imageFile && cb.types?.length > 0) {
          const types = Array.from(cb.types);
          const hasImage = types.some(t => t.startsWith('image/') || t === 'Files');
          console.log('[Paste] Checking types, hasImage:', hasImage);
          if (hasImage && cb.files?.length > 0) {
            imageFile = Array.from(cb.files)[0];
            console.log('[Paste] Found from types/files:', imageFile?.name, imageFile?.type);
          }
        }

        if (!imageFile) {
          console.log('[Paste] No image found in clipboard');
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (uploadingRef.current) return;
        uploadingRef.current = true;
        setUploading(true);
        setPasteDetected(true);

        try {
          console.log('[Paste] Uploading to server...');
          const result = await noteService.uploadImage(imageFile);
          console.log('[Paste] Upload result:', result);
          const url = result.data?.url;
          if (url) {
            console.log('[Paste] Inserting server URL:', url);
            await insertImage.current(url);
            uploadingRef.current = false;
            setUploading(false);
            return;
          }
          console.warn('[Paste] Server upload returned no URL');
        } catch (uploadError) {
          console.warn('[Paste] Server upload failed:', uploadError.message, uploadError.response?.status);
        }

        try {
          console.log('[Paste] Falling back to base64...');
          const base64 = await fileToBase64(imageFile);
          if (base64 && base64.length < 15 * 1024 * 1024) {
            console.log('[Paste] Inserting base64 image, size:', base64.length);
            await insertImage.current(base64);
          } else {
            const sizeMB = (base64?.length || 0) / (1024 * 1024);
            console.error(`[Paste] Image too large for base64 embed (${sizeMB.toFixed(1)}MB > 15MB limit)`);
            alert('Image too large. Try a smaller image (< 10MB original size).');
          }
        } catch (base64Error) {
          console.error('[Paste] Base64 fallback failed:', base64Error.message);
          alert('Failed to insert image. Check console for details.');
        }

        uploadingRef.current = false;
        setUploading(false);
      } catch (err) {
        console.error('[Paste] Unhandled error in paste handler:', err.message, err.stack);
        uploadingRef.current = false;
        setUploading(false);
      }
    };

    dom.addEventListener('paste', onPasteCapture, true);
    return () => dom.removeEventListener('paste', onPasteCapture, true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const onSelect = () => {
      try {
        const { selection } = editor.state;
        if (selection.node?.type.name === 'image') {
          setSelectedImage(selection.node);
          setImageWidth(selection.node.attrs.width || '');
        } else {
          setSelectedImage(null);
        }
      } catch {
        setSelectedImage(null);
      }
    };
    editor.on('selectionUpdate', onSelect);
    return () => editor.off('selectionUpdate', onSelect);
  }, [editor]);

  const handleFileSelect = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        console.warn('[FileSelect] No file selected');
        return;
      }
      if (uploadingRef.current) return;

      console.log('[FileSelect] Selected file:', file.name, file.type, file.size);

      uploadingRef.current = true;
      setUploading(true);

      try {
        console.log('[FileSelect] Uploading to server...');
        const result = await noteService.uploadImage(file);
        console.log('[FileSelect] Upload result:', result);
        const url = result.data?.url;
        if (url) {
          console.log('[FileSelect] Inserting server URL:', url);
          await insertImage.current(url);
          uploadingRef.current = false;
          setUploading(false);
          e.target.value = '';
          return;
        }
        console.warn('[FileSelect] Server upload returned no URL');
      } catch (uploadError) {
        console.warn('[FileSelect] Server upload failed:', uploadError.message, uploadError.response?.status);
      }

      try {
        console.log('[FileSelect] Falling back to base64...');
        const base64 = await fileToBase64(file);
          if (base64 && base64.length < 15 * 1024 * 1024) {
            console.log('[FileSelect] Inserting base64 image, size:', base64.length);
            await insertImage.current(base64);
          } else {
            const sizeMB = (base64?.length || 0) / (1024 * 1024);
            console.error(`[FileSelect] Image too large for base64 embed (${sizeMB.toFixed(1)}MB > 15MB limit)`);
            alert('Image too large. Try a smaller image (< 10MB original size).');
          }
        } catch (base64Error) {
          console.error('[FileSelect] Base64 fallback failed:', base64Error.message);
          alert('Failed to insert image. Check console for details.');
        }

        uploadingRef.current = false;
        setUploading(false);
        e.target.value = '';
    } catch (err) {
      console.error('[FileSelect] Unhandled error:', err.message, err.stack);
      uploadingRef.current = false;
      setUploading(false);
    }
  };

  const toggleLinkInput = () => {
    if (showLinkInput) {
      setShowLinkInput(false);
      setLinkUrl('');
      return;
    }
    const prev = editor.getAttributes('link').href;
    setLinkUrl(prev || '');
    setShowLinkInput(true);
  };

  const addLink = () => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

  if (!editor) return null;

  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
  const currentFontFamily = editor.getAttributes('textStyle').fontFamily || '';

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="sticky top-0 z-10 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)] px-3 py-2 flex flex-wrap items-center gap-0.5 shadow-sm">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <select
          value={currentFontSize}
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs border border-[var(--border-color)] rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-amber/30 transition-colors"
        >
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={currentFontFamily}
          onChange={(e) => {
            if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs border border-[var(--border-color)] rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-amber/30 transition-colors min-w-[90px]"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.value || 'default'} value={f.value}>{f.label}</option>
          ))}
        </select>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <div className="relative flex">
          <ToolbarButton onClick={toggleLinkInput} active={showLinkInput || editor.isActive('link')} title="Add / Edit Link">
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1.5 p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-xl z-20 flex items-center gap-2 min-w-[280px] backdrop-blur-sm">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm border border-[var(--border-color)] rounded-lg outline-none focus:border-amber/40 transition-colors placeholder:text-[var(--text-tertiary)]"
                autoFocus
              />
              <button onClick={addLink} className="px-3 py-2 bg-amber/20 text-amber rounded-lg hover:bg-amber/30 text-sm font-medium transition-colors whitespace-nowrap">
                {editor.getAttributes('link').href ? 'Update' : 'Add'}
              </button>
              {editor.getAttributes('link').href && (
                <button onClick={removeLink} className="p-2 bg-rose/20 text-rose rounded-lg hover:bg-rose/30 transition-colors" title="Remove link">
                  <Unlink className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          active={false}
          title={uploading ? 'Uploading...' : 'Insert Image'}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </ToolbarButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
      </div>

      {selectedImage && (
        <div className="sticky top-[49px] z-10 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)] px-3 py-2 flex items-center gap-2 shadow-sm">
          <span className="text-xs text-[var(--text-secondary)] font-medium mr-1">Image:</span>
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes('image', { dataAlign: null }).run()}
            active={!selectedImage?.attrs?.dataAlign}
            title="Default"
          >
            <Maximize2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes('image', { dataAlign: 'left' }).run()}
            active={selectedImage?.attrs?.dataAlign === 'left'}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes('image', { dataAlign: 'center' }).run()}
            active={selectedImage?.attrs?.dataAlign === 'center'}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes('image', { dataAlign: 'right' }).run()}
            active={selectedImage?.attrs?.dataAlign === 'right'}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarDivider />
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <input
              type="number"
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
              onBlur={() => {
                if (imageWidth) {
                  editor.chain().focus().updateAttributes('image', { width: imageWidth + (isNaN(Number(imageWidth)) ? '' : 'px') }).run();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              placeholder="auto"
              min="50"
              max="1200"
              className="w-20 px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs border border-[var(--border-color)] rounded-lg outline-none focus:border-amber/40"
            />
            <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
          </div>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => {
              editor.chain().focus().deleteSelection().run();
              setSelectedImage(null);
            }}
            title="Delete Image"
          >
            <Trash2 className="w-4 h-4 text-rose" />
          </ToolbarButton>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
        <div className="flex justify-center py-8 px-4 min-h-full">
          <div className="book-page">
            <EditorContent editor={editor} className="book-page-content" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;
