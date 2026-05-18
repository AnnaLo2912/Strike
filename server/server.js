import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import boardRoutes from './routes/boards.js';
import taskRoutes from './routes/tasks.js';
import habitRoutes from './routes/habits.js';
import googleRoutes from './routes/google.js';  // NEW
import eventRoutes from './routes/events.js';    // NEW
import noteRoutes from './routes/notes.js';       // NEW

dotenv.config();
console.log('\n=== ENVIRONMENT VARIABLES TEST ===');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded ✅' : 'Missing ❌');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Loaded ✅' : 'Missing ❌');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Loaded ✅' : 'Missing ❌');
console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);
console.log('===================================\n');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/google', googleRoutes);  // NEW
app.use('/api/events', eventRoutes);    // NEW
app.use('/api/notes', noteRoutes);      // NEW

app.get('/', (req, res) => res.json({ message: 'Strike API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


