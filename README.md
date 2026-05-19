# Strike

A comprehensive full-stack productivity and learning management application designed to help users organize their tasks, habits, notes, classroom activities, and schedules in one unified platform.

**Live Demo:** [https://strike-hazel.vercel.app/](https://strike-hazel.vercel.app/)

## Features

- **Dashboard** - Centralized overview of all your activities and progress
- **Tasks** - Create, organize, and track your to-do items
- **Habits** - Build and monitor daily habits with streak tracking
- **Notes** - Write and organize notes with a clean interface
- **Calendar** - Schedule and view events across a calendar
- **Boards** - Organize tasks with Kanban-style boards
- **Classroom** - Manage classroom-related activities and materials
- **Analytics** - Track your productivity and progress with detailed insights
- **Authentication** - Secure login with Google OAuth support

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **JavaScript/JSX** - Programming language
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Google OAuth** - Authentication

## Project Structure

```
Strike/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── context/     # React context for state management
│   │   └── utils/       # Utility functions
│   ├── package.json
│   └── vite.config.js
│
└── server/              # Backend Node.js application
    ├── controllers/     # Request handlers
    ├── models/          # Database schemas
    ├── routes/          # API routes
    ├── middleware/      # Express middleware
    ├── config/          # Configuration files
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Strike
   ```

2. **Install dependencies for the frontend**
   ```bash
   cd client
   npm install
   ```

3. **Install dependencies for the backend**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` file in the `server` directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     JWT_SECRET=your_jwt_secret
     ```
   - Create `.env` file in the `client` directory with:
     ```
     VITE_API_URL=http://localhost:5000
     ```

5. **Start the development servers**

   Terminal 1 - Start the backend:
   ```bash
   cd server
   npm start
   ```

   Terminal 2 - Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## Available Scripts

### Client
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Server
- `npm start` - Start the server
- `npm run dev` - Start with nodemon for development

## Deployment

The frontend is deployed on Vercel. To deploy:
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue in the repository.

---

**Live Application:** [https://strike-hazel.vercel.app/](https://strike-hazel.vercel.app/)
