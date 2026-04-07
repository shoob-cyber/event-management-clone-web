@echo off
REM Event Booking System - Quick Setup Script for Windows

echo.
echo ===== Event Booking System Setup =====
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Setup Backend
echo [1/3] Setting up Backend...
cd booking-backend
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo Please update .env with your Twilio and MongoDB credentials
)
call npm install
cd ..

echo.
echo [2/3] Setting up Frontend...
cd booking-frontend
call npm install
cd ..

echo.
echo [3/3] Installation Complete!
echo.
echo ===== What to do next =====
echo.
echo 1. Update booking-backend/.env with your credentials:
echo    - TWILIO_ACCOUNT_SID
echo    - TWILIO_AUTH_TOKEN
echo    - TWILIO_PHONE_NUMBER
echo    - MONGO_URI (if using custom MongoDB)
echo.
echo 2. Install concurrently for easy development:
echo    npm install -D concurrently
echo.
echo 3. Run both servers:
echo.
echo    Option A: Separate terminals
echo    Terminal 1: cd booking-backend && npm start
echo    Terminal 2: cd booking-frontend && npm start
echo.
echo    Option B: Using concurrently (from root)
echo    npm install -D concurrently
echo    concurrently "cd booking-backend && npm start" "cd booking-frontend && npm start"
echo.
echo 4. Access the dashboard at http://localhost:3000
echo    Default credentials: admin / admin123
echo.
echo ===== API Documentation =====
echo.
echo Backend API runs on: http://localhost:3000
echo API endpoints: http://localhost:3000/api/*
echo.
echo POST   /api/auth/login        - Login
echo GET    /api/auth/check        - Check auth status
echo GET    /api/auth/logout       - Logout
echo.
echo GET    /api/bookings          - Get all bookings
echo GET    /api/bookings/:id      - Get booking details
echo POST   /api/bookings          - Create booking
echo PUT    /api/bookings/:id      - Update booking
echo DELETE /api/bookings/:id      - Delete booking
echo POST   /api/bookings/:id/status - Update booking status
echo.
echo GET    /api/dashboard-stats   - Get statistics
echo.
