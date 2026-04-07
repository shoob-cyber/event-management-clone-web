# Booking System - Integration Testing & Verification Guide

## Pre-Flight Checklist

- [ ] Node.js v16+ installed
- [ ] MongoDB Atlas account with connection string
- [ ] Twilio account with credentials
- [ ] Backend `.env` file configured
- [ ] All npm dependencies installed

## Backend Testing

### 1. Start Backend Server
```bash
cd booking-backend
npm start
```

Expected output:
```
✅ MongoDB connected
🔐 Admin created: admin / admin123
🚀 Server running on http://localhost:3000
📋 API Base: http://localhost:3000/api
🔐 Admin Panel: http://localhost:3000/admin/login
```

### 2. Test Authentication Endpoints

#### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

Expected response:
```json
{"success": true, "message": "Login successful"}
```

#### Test Auth Check
```bash
curl -X GET http://localhost:3000/api/auth/check \
  -b cookies.txt
```

Expected response:
```json
{"authenticated": true}
```

### 3. Test Bookings API

#### Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"9876543210",
    "eventType":"Wedding",
    "date":"2024-06-15",
    "package":"Gold",
    "message":"Looking forward to it"
  }'
```

#### Get All Bookings
```bash
curl -X GET http://localhost:3000/api/bookings \
  -b cookies.txt
```

#### Get Single Booking
```bash
curl -X GET http://localhost:3000/api/bookings/{BOOKING_ID} \
  -b cookies.txt
```

#### Update Booking Status
```bash
curl -X POST http://localhost:3000/api/bookings/{BOOKING_ID}/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"status":"Approved"}'
```

#### Update Booking
```bash
curl -X PUT http://localhost:3000/api/bookings/{BOOKING_ID} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name":"John Doe Updated",
    "status":"Approved"
  }'
```

#### Delete Booking
```bash
curl -X DELETE http://localhost:3000/api/bookings/{BOOKING_ID} \
  -b cookies.txt
```

### 4. Test Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/dashboard-stats \
  -b cookies.txt
```

Expected response:
```json
{
  "total": 5,
  "approved": 2,
  "pending": 2,
  "rejected": 1
}
```

## Frontend Testing

### 1. Start Frontend Server
```bash
cd booking-frontend
npm start
```

Frontend will open at `http://localhost:3000` or `http://localhost:3001` (if 3000 is taken)

### 2. Test Login Flow
1. Open http://localhost:3000/login
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"
4. Should redirect to Dashboard

### 3. Test Dashboard Features

#### View Bookings
- Dashboard should load with all bookings in table
- Table should show columns: Name, Email, Phone, Event Type, Date, Package, Status, Actions

#### Filter by Status
- Click filter buttons (All, Pending, Approved, Rejected)
- Table should update accordingly

#### View Statistics
- Dashboard should display 4 stat cards:
  - Total Bookings
  - Pending
  - Approved
  - Rejected

#### Edit Booking
1. Click edit icon in table
2. Modify booking details
3. Click "Save Changes"
4. Should return to dashboard

#### Change Booking Status
1. Click status icon (checkmark) for a booking
2. Modal should appear with current status
3. Select new status and click "Update Status"
4. Success message should appear

#### Delete Booking
1. Click delete icon (trash) for a booking
2. Confirm deletion in browser prompt
3. Booking should be removed from table

### 4. Test Logout
1. Click "Logout" button
2. Should redirect to login page
3. Trying to access dashboard should redirect to login

## Integration Testing (Both Frontend & Backend)

### Full Workflow Test

1. **Backend Running**
   ```bash
   cd booking-backend && npm start
   ```

2. **Frontend Running**
   ```bash
   cd booking-frontend && npm start
   ```

3. **Test Complete Workflow**
   - Login with admin credentials ✓
   - Create new booking via API ✓
   - View booking in dashboard ✓
   - Edit booking details ✓
   - Change booking status to "Approved" ✓
   - Verify SMS notification sent (check Twilio console) ✓
   - Delete booking ✓
   - Verify stats update automatically ✓
   - Logout successfully ✓

## API Response Validation

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "booking": { /* booking details */ }
}
```

### Error Response Format
```json
{
  "error": "Description of error"
}
```

### Booking Object Structure
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "phone": "string",
  "eventType": "string",
  "date": "string (YYYY-MM-DD)",
  "message": "string",
  "package": "string (Silver/Gold/Platinum)",
  "status": "string (Pending/Approved/Rejected)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Performance Testing

### Page Load Times
- Dashboard: Should load < 2 seconds
- Login: Should load < 1 second
- Edit page: Should load < 2 seconds

### API Response Times
- GET /api/bookings: < 500ms
- POST /api/bookings: < 1s
- GET /api/dashboard-stats: < 300ms

## Security Checklist

- [ ] Authentication required for all API endpoints
- [ ] Session cookies are httpOnly and secure
- [ ] CORS is properly configured
- [ ] Password is hashed with bcrypt
- [ ] SQL injection not possible (using MongoDB with Mongoose)
- [ ] Rate limiting implemented (optional enhancement)
- [ ] HTTPS enabled in production

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Verify connection string in `.env`
- Check internet connectivity for MongoDB Atlas
- Verify IP whitelist in MongoDB Atlas

**Twilio SMS Not Sending**
- Verify Twilio credentials in `.env`
- Check phone number format (+91XXXXX)
- Check Twilio account balance
- Check console for error messages

**CORS Errors**
- Verify frontend URL is in CORS whitelist in server.js
- Check that credentials are sent with requests
- Try clearing browser cache

### Frontend Issues

**Cannot Connect to Backend**
- Verify backend is running on port 3000
- Check proxy setting in package.json
- Try connecting directly: http://localhost:3000/api/auth/check

**Login Not Working**
- Check browser console for errors
- Verify credentials are correct
- Check network tab for API calls

**Dashboard Not Loading**
- Check if authentication is valid
- Verify API endpoints are working
- Check browser console error

## Browser DevTools Testing

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Login and check requests:
   - Should see POST to `/api/auth/login`
   - Should see GET to `/api/bookings`
   - Should see GET to `/api/dashboard-stats`

### Local Storage (if implemented)
- Check for any stored auth tokens
- Verify session cookies

### Console
- Should show no errors
- Warnings are acceptable
- Check for any API error messages

## Postman Testing

1. Create Postman collection with all endpoints
2. Configure environment variables:
   - `base_url`: http://localhost:3000
   - `booking_id`: [populated after creation]
3. Test each endpoint in sequence
4. Use Postman Runner for full workflow test

## Load Testing

For production:
- Use tools like Apache JMeter or Artillery
- Test with 100+ concurrent users
- Verify database performance
- Check server resource usage

## Final Verification

Run this checklist before deployment:

- [ ] All API endpoints responding correctly
- [ ] Authentication working with valid/invalid credentials
- [ ] Bookings CRUD operations working
- [ ] SMS notifications sending successfully
- [ ] Dashboard displaying data correctly
- [ ] Responsive design on mobile devices
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Database backup configured
- [ ] Environment variables secured
- [ ] Error handling for edge cases
- [ ] Performance acceptable

## Documentation

This system includes:
- API documentation (this file)
- Setup guide (BOOKING_SYSTEM_README.md)
- Code comments for complex logic
- Component documentation with JSDoc
