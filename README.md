# Newspaper Submission System

A full-stack application for managing article submissions with separate frontend and backend deployments on Vercel.

## Project Structure

```
.
├── server/         # Backend Node.js/Express API
└── src/           # Frontend React application
```

## Deployment Instructions

### 1. Frontend Deployment

1. Fork/Clone this repository
2. Create a new project on Vercel
3. Connect your repository
4. Set the following environment variables:
   ```
   REACT_APP_API_URL=your-backend-url/api
   ```
5. Deploy using these settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 2. Backend Deployment

1. Create a new project on Vercel
2. Connect the same repository but set the root directory to `/server`
3. Set the following environment variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   ```
4. Deploy using these settings:
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: `./`
   - Install Command: `npm install`

### Setting Up Vercel Blob Storage

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Link your project: `vercel link`
4. Get your Blob token:
   ```bash
   vercel env pull
   ```
5. Add the token to your environment variables

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

3. Create `.env` files:
   ```bash
   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:5000/api

   # Backend (server/.env)
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. Start the development servers:
   ```bash
   # Start backend (in server directory)
   npm run dev

   # Start frontend (in root directory)
   npm start
   ```

## Features

- User authentication (JWT)
- Article submission with file uploads
- Editor/Admin article management
- File storage using Vercel Blob Storage
- Responsive UI with real-time feedback
- Role-based access control

## Testing

```bash
# Seed test data
cd server
npm run seed

# Test users created:
# - Regular User: test@example.com / password123
# - Editor: editor@example.com / password123
# - Admin: admin@example.com / password123
```

## API Routes

### Authentication
- POST /api/auth/register - Create new account
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Articles
- GET /api/articles - Get user's articles
- POST /api/articles - Submit new article
- GET /api/articles/pending - Get pending articles (editor/admin)
- PUT /api/articles/:id - Update article status
- DELETE /api/articles/:id - Delete article
