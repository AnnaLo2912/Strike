import { google } from 'googleapis';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Task from '../models/Task.js';
import Board from '../models/Board.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Helper function to create OAuth client
const createOAuth2Client = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('❌ Missing Google OAuth credentials in .env file');
    console.error('   GOOGLE_CLIENT_ID:', clientId ? 'SET' : 'MISSING');
    console.error('   GOOGLE_CLIENT_SECRET:', clientSecret ? 'SET' : 'MISSING');
    console.error('   GOOGLE_REDIRECT_URI:', redirectUri ? 'SET' : 'MISSING');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

// Get Google OAuth URL
export const getAuthUrl = async (req, res) => {
  try {
    const oauth2Client = createOAuth2Client();
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      prompt: 'consent',
      state: req.user.id
    });
    
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('❌ Error generating auth URL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating auth URL', 
      error: error.message 
    });
  }
};

// Handle OAuth callback
export const handleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    const oauth2Client = createOAuth2Client();
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    
    // Update user with tokens
    const user = await User.findById(state);
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/dashboard?error=user_not_found`);
    }
    
    user.googleId = data.id;
    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token;
    user.classroomSyncEnabled = true;
    await user.save();
    
    // Redirect back to frontend
    res.redirect(`${process.env.CLIENT_URL}/dashboard?classroom=connected`);
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?error=auth_failed`);
  }
};

// Sync classroom assignments
export const syncClassroom = async (req, res) => {
  let user;
  try {
    console.log('🔍 [Sync] Step 1: Fetching user...');
    user = await User.findById(req.user.id).select('+googleAccessToken +googleRefreshToken');
    
    if (!user) {
      console.error('❌ [Sync] User not found:', req.user.id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('🔍 [Sync] User found. Access token:', user.googleAccessToken ? 'EXISTS' : 'MISSING', '| Refresh token:', user.googleRefreshToken ? 'EXISTS' : 'MISSING');

    if (!user.googleAccessToken) {
      return res.status(400).json({ success: false, message: 'Google Classroom not connected' });
    }

    console.log('🔍 [Sync] Step 2: Creating OAuth client...');
    const oauth2Client = createOAuth2Client();
    
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });
    
    console.log('🔍 [Sync] Step 3: Calling Google Classroom API (courses.list)...');
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
    
    let coursesResponse;
    try {
      coursesResponse = await classroom.courses.list({
        studentId: 'me',
        courseStates: ['ACTIVE']
      });
    } catch (apiError) {
      console.error('❌ [Sync] Google Classroom API error:', apiError?.message);
      console.error('   Response status:', apiError?.response?.status);
      console.error('   Response data:', JSON.stringify(apiError?.response?.data || {}).slice(0, 500));
      console.error('   Error code:', apiError?.code);
      
      const status = apiError?.response?.status || apiError?.code;
      const errData = apiError?.response?.data?.error || {};
      
      if (status === 401 || status === 403 || errData.code === 401 || errData.code === 403) {
        if (user) {
          user.googleAccessToken = undefined;
          user.googleRefreshToken = undefined;
          user.classroomSyncEnabled = false;
          await user.save({ validateBeforeSave: false });
        }
        return res.status(401).json({ 
          success: false, 
          message: 'Google Classroom access expired or denied. Please reconnect.',
          needsReconnect: true,
          details: errData.message || apiError?.message
        });
      }
      
      throw apiError;
    }
    
    console.log('🔍 [Sync] Step 3 OK. Courses found:', coursesResponse.data.courses?.length || 0);
    const courses = coursesResponse.data.courses || [];
    
    let allAssignments = [];
    
    for (const course of courses) {
      try {
        const courseWorkResponse = await classroom.courses.courseWork.list({
          courseId: course.id
        });
        
        const courseWork = courseWorkResponse.data.courseWork || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (const work of courseWork) {
          if (work.dueDate) {
            const dueDate = new Date(
              work.dueDate.year,
              work.dueDate.month - 1,
              work.dueDate.day,
              work.dueTime?.hours || 23,
              work.dueTime?.minutes || 59
            );
            
            if (dueDate >= today) {
              allAssignments.push({
                title: work.title,
                description: work.description || '',
                courseName: course.name,
                courseId: course.id,
                assignmentId: work.id,
                dueDate: dueDate,
                link: work.alternateLink
              });
            }
          }
        }
      } catch (error) {
        console.error(`❌ [Sync] Error fetching coursework for ${course.name}:`, error.message);
      }
    }
    
    console.log('🔍 [Sync] Step 4: Total future assignments:', allAssignments.length);
    
    let classroomBoard = await Board.findOne({ 
      user: req.user.id, 
      name: 'Google Classroom' 
    });
    
    if (!classroomBoard) {
      console.log('🔍 [Sync] Creating Google Classroom board...');
      classroomBoard = await Board.create({
        name: 'Google Classroom',
        description: 'Synced from Google Classroom',
        color: '#4285f4',
        user: req.user.id
      });
    }
    
    console.log('🔍 [Sync] Step 5: Creating tasks and events...');
    let createdCount = 0;
    
    for (const assignment of allAssignments) {
      const existingTask = await Task.findOne({
        user: req.user.id,
        title: assignment.title,
        board: classroomBoard._id
      });
      
      if (!existingTask) {
        const task = await Task.create({
          title: assignment.title,
          description: `${assignment.courseName}\n\n${assignment.description}`,
          status: 'todo',
          priority: 'medium',
          dueDate: assignment.dueDate,
          board: classroomBoard._id,
          user: req.user.id
        });
        
        await Event.create({
          title: `${assignment.courseName}: ${assignment.title}`,
          description: assignment.description,
          startDate: assignment.dueDate,
          allDay: true,
          color: '#4285f4',
          type: 'classroom',
          classroomCourseId: assignment.courseId,
          classroomAssignmentId: assignment.assignmentId,
          taskId: task._id,
          user: req.user.id,
          isDeadline: true
        });
        
        createdCount++;
      }
    }
    
    console.log('🔍 [Sync] Step 6: Saving last sync time...');
    user.lastClassroomSync = new Date();
    await user.save();
    
    console.log('✅ [Sync] Done! Created', createdCount, 'new tasks.');
    res.json({ 
      success: true, 
      message: `Synced ${createdCount} new assignments from Google Classroom`,
      totalAssignments: allAssignments.length,
      newAssignments: createdCount
    });
    
  } catch (error) {
    console.error('❌ [Sync] UNEXPECTED ERROR:', error?.message || error);
    console.error('   Stack:', error?.stack);
    
    const status = error?.response?.status || error?.code;
    const errData = error?.response?.data?.error || {};
    const errMsg = error?.message || '';
    
    const isAuthError = 
      status === 401 ||
      errMsg.includes('invalid_grant') || 
      errMsg.includes('Token has been expired') ||
      errMsg.includes('invalid_token') ||
      errMsg.includes('Token used too late') ||
      errMsg.includes('jwt malformed') ||
      errData.code === 401;

    if (isAuthError && user) {
      try {
        user.googleAccessToken = undefined;
        user.googleRefreshToken = undefined;
        user.classroomSyncEnabled = false;
        await user.save({ validateBeforeSave: false });
      } catch (saveError) {
        console.error('❌ Failed to clear user tokens:', saveError.message);
      }
      return res.status(401).json({ 
        success: false, 
        message: 'Google Classroom access expired. Please reconnect.',
        needsReconnect: true
      });
    }
    
    if (errMsg.includes('invalid_client') || errMsg.includes('client_id') || errMsg.includes('GOOGLE_CLIENT')) {
      return res.status(500).json({ 
        success: false, 
        message: 'Google OAuth credentials not configured. Please check server .env file.',
        error: errMsg
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error syncing classroom: ' + errMsg,
      error: errMsg 
    });
  }
};

// Disconnect classroom
export const disconnectClassroom = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.googleAccessToken = undefined;
    user.googleRefreshToken = undefined;
    user.classroomSyncEnabled = false;
    
    await user.save();
    
    res.json({ success: true, message: 'Google Classroom disconnected' });
  } catch (error) {
    console.error('❌ Error disconnecting classroom:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error disconnecting classroom', 
      error: error.message 
    });
  }
};

// Get classroom status
export const getClassroomStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        connected: user.classroomSyncEnabled,
        lastSync: user.lastClassroomSync
      }
    });
  } catch (error) {
    console.error('❌ Error getting status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting status', 
      error: error.message 
    });
  }
};

// NEW: Get classroom deadlines and important tasks
export const getClassroomDeadlines = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get upcoming classroom deadlines
    const deadlines = await Event.find({
      user: req.user.id,
      isDeadline: true,
      startDate: { $gte: today }
    })
      .populate('taskId', 'title status priority isImportant')
      .sort({ startDate: 1 });
    
    // Get important tasks with due dates
    const importantTasks = await Task.find({
      user: req.user.id,
      isImportant: true,
      dueDate: { $gte: today }
    })
      .populate('board', 'name color')
      .sort({ dueDate: 1 });
    
    // Get important events
    const importantEvents = await Event.find({
      user: req.user.id,
      isImportant: true,
      startDate: { $gte: today }
    })
      .populate('taskId', 'title status')
      .sort({ startDate: 1 });
    
    res.json({
      success: true,
      data: {
        deadlines,
        importantTasks,
        importantEvents
      }
    });
  } catch (error) {
    console.error('❌ Error getting classroom deadlines:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting classroom deadlines', 
      error: error.message 
    });
  }
};