# Booking Management System - Setup Guide

## Project Structure
```
event-management-clone-web/
├── booking-backend/           # Express API Server
│   ├── server.js             # Main server file with all API endpoints
│   ├── package.json
│   ├── .env                  # Environment variables
│   └── public/
│       └── views/            # EJS templates (legacy)
│
└── booking-frontend/         # React Dashboard
    ├── src/
    │   ├── App.js           # Main App component
    │   ├── pages/           # Pages (Login, Dashboard, EditBooking)
    │   ├── components/      # Reusable components
    │   ├── context/         # React Context (Auth)
    │   ├── styles/          # Component styles
    │   └── index.js         # Entry point
    ├── public/
    │   └── index.html
    └── package.json
```

## Backend Setup

### 1. Install Dependencies
```bash
cd booking-backend
npm install
```

### 2. Configure Environment Variables
Create/Update `.env` file with your credentials:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
SESSION_SECRET=your_secret_key
```

### 3. Start Backend Server
```bash
npm start
# Server will run on http://localhost:3000
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd booking-frontend
npm install
```

### 2. Start Development Server
```bash
npm start
# Frontend will run on http://localhost:3000 (with backend proxy)
# Or manually on http://localhost:3001 if port 3000 is taken
```

### 3. Build for Production
```bash
npm run build
# Creates optimized build in build/ folder
```

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - Login with username/password
- **GET** `/api/auth/check` - Check if user is authenticated
- **GET** `/api/auth/logout` - Logout user

### Bookings
- **GET** `/api/bookings` - Get all bookings
- **GET** `/api/bookings/:id` - Get specific booking
- **POST** `/api/bookings` - Create new booking
- **PUT** `/api/bookings/:id` - Update booking
- **DELETE** `/api/bookings/:id` - Delete booking
- **POST** `/api/bookings/:id/status` - Update booking status

### Dashboard
- **GET** `/api/dashboard-stats` - Get booking statistics

### Public
- **POST** `/submit-booking` - Public booking submission (from website)

## Default Credentials
- Username: `admin`
- Password: `admin123`

## Features

### Frontend Dashboard (React)
- ✅ User authentication with session management
- ✅ View all bookings in a responsive table
- ✅ Filter bookings by status (All, Pending, Approved, Rejected)
- ✅ Real-time statistics dashboard
- ✅ Edit booking details
- ✅ Update booking status with SMS notifications
- ✅ Delete bookings
- ✅ Search and sort functionality
- ✅ Mobile-responsive design

### Backend
- ✅ Express.js REST API
- ✅ MongoDB database integration
- ✅ Session-based authentication
- ✅ Twilio SMS integration for notifications
- ✅ CORS support for React frontend
- ✅ Error handling and validation
- ✅ Supporting both API and legacy EJS views

## Running Both Frontend and Backend

### Option 1: Separate Terminals
```bash
# Terminal 1 - Backend
cd booking-backend
npm start

# Terminal 2 - Frontend
cd booking-frontend
npm start
```

### Option 2: Using Concurrently (recommended)
Create a root `package.json` with:
```json
{
  "scripts": {
    "dev": "concurrently \"cd booking-backend && npm start\" \"cd booking-frontend && npm start\""
  }
}
```

Then run:
```bash
npm install concurrently
npm run dev
```

## Deployment

### Backend Deployment (Heroku/Railway)
1. Push to Git repository
2. Connect to Heroku/Railway
3. Set environment variables in deployment platform
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy `build/` folder to Vercel/Netlify
3. Set API base URL in proxy settings or environment variables

## Troubleshooting

### CORS Errors
- Make sure `CORS_ORIGIN` includes your frontend URL
- Check that credentials are being sent with requests

### Authentication Issues
- Verify session secret is consistent between restarts
- Check that cookies are being sent with credentials: true

### Database Connection
- Verify MongoDB connection string in `.env`
- Check internet connection for MongoDB Atlas

### SMS Not Sending
- Verify Twilio credentials are correct
- Check phone number format (+91XXXXX)
- Check Twilio account balance

## Technologies Used

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Twilio SMS API
- Express Sessions
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Bootstrap 5
- React Icons
- CSS3 for styling

## Support & Documentation

For more information:
- Express.js: https://expressjs.com
- React: https://react.dev
- MongoDB: https://docs.mongodb.com
- Twilio: https://www.twilio.com/docs
