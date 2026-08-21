# Adopt a Hippo

A simple web application for hippo adoption requests with case management.

## Features

- **Adoption Form**: Users can request to adopt a hippo by providing their name and agreeing to terms
- **Admin Dashboard**: Case managers can review, approve, or reject adoption requests
- **Real-time Updates**: Dashboard refreshes every 5 seconds to show new submissions
- **Statistics**: View overview of total, pending, approved, and rejected requests

## Project Structure

```
adopt-a-hippo/
├── src/
│   └── app.js              # Express backend server
├── public/
│   ├── index.html          # Adoption request form
│   └── admin.html          # Case management dashboard
├── data/
│   └── submissions.json    # Submissions data (created on first run)
├── package.json            # Project dependencies
└── README.md               # This file
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

You'll see:
```
🦛 Adopt a Hippo service running on http://localhost:3000
📋 Visit http://localhost:3000 to adopt a hippo
👨‍⚖️ Visit http://localhost:3000/admin to manage submissions
```

### 3. Use the Application

**For Users:**
- Visit http://localhost:3000
- Fill in your name
- Confirm you want to adopt a hippo
- Agree to the consent
- Submit your request

**For Admins:**
- Visit http://localhost:3000/admin
- View all adoption requests
- Filter by status (Pending, Approved, Rejected)
- Click Approve or Reject to review requests
- Dashboard auto-refreshes every 5 seconds

## API Endpoints

### Submit Adoption Request
```
POST /api/adopt
Content-Type: application/json

{
  "name": "Jane Doe",
  "confirm": true,
  "consent": true
}

Response:
{
  "success": true,
  "message": "Thank you! Your adoption request has been submitted...",
  "id": 1234567890
}
```

### Get All Submissions
```
GET /api/submissions

Response: Array of submission objects
```

### Get Single Submission
```
GET /api/submissions/:id

Response: Single submission object
```

### Review Submission
```
POST /api/submissions/:id/review
Content-Type: application/json

{
  "status": "approved",
  "reviewer": "admin"
}

Response:
{
  "success": true,
  "message": "Submission approved",
  "submission": {...}
}
```

### Get Statistics
```
GET /api/stats

Response:
{
  "total": 5,
  "pending": 2,
  "approved": 2,
  "rejected": 1
}
```

## Data Storage

Submissions are stored in `data/submissions.json`. Each submission object contains:

- `id` - Unique timestamp ID
- `name` - User's name
- `confirm` - Whether they confirmed adoption
- `consent` - Whether they agreed to terms
- `status` - 'pending', 'approved', or 'rejected'
- `submittedAt` - ISO timestamp
- `reviewedAt` - ISO timestamp (null if pending)
- `reviewedBy` - Name of reviewer (null if pending)

## Technologies Used

- **Backend**: Node.js + Express.js
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Data Storage**: JSON file (no database required)

## Stopping the Server

Press `Ctrl + C` in your terminal to stop the server.

## Troubleshooting

**Port 3000 already in use?**
- Change the PORT variable in src/app.js
- Or kill the process using port 3000

**Data not persisting?**
- Check that the `data/` folder was created
- Check file permissions

**Admin dashboard not showing submissions?**
- Make sure the server is still running
- Check browser console for errors
- Try refreshing the page

## Next Steps

You can extend this application by:
- Adding a database (PostgreSQL, MongoDB)
- Adding user authentication
- Sending confirmation emails
- Adding more fields to the adoption form
- Creating an API for mobile apps

---

Built with ❤️ and AI
