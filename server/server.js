import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import boardRoutes from './routes/boards.js';
import taskRoutes from './routes/tasks.js';
import habitRoutes from './routes/habits.js';
import googleRoutes from './routes/google.js';  // NEW
import eventRoutes from './routes/events.js';    // NEW
import noteRoutes from './routes/notes.js';       // NEW
import { uploadRoutes } from './routes/upload.js';

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev; tighten in production
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/google', googleRoutes);  // NEW
app.use('/api/events', eventRoutes);    // NEW
app.use('/api/notes', noteRoutes);      // NEW
app.use('/api/notes', uploadRoutes);

app.get('/', (req, res) => res.json({ message: 'Strike API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==> Server is running on port ${PORT}`);
  console.log(`==> API: http://localhost:${PORT}/api\n`);
});


