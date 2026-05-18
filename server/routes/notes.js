import express from 'express';
import { getNotebooks, createNotebook, updateNotebook, deleteNotebook, addPage, updatePage, deletePage, getPages, addCollaborator, removeCollaborator } from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotebooks)
  .post(createNotebook);

router.route('/notebook/:id')
  .put(updateNotebook)
  .delete(deleteNotebook);

router.route('/notebook/:id/collaborators')
  .post(addCollaborator);

router.route('/notebook/:id/collaborators/:collaboratorId')
  .delete(removeCollaborator);

router.route('/notebook/:notebookId/pages')
  .get(getPages)
  .post(addPage);

router.route('/page/:id')
  .put(updatePage)
  .delete(deletePage);

export default router;