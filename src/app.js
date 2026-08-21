const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data file path
const dataFile = path.join(__dirname, '../data/submissions.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Helper function to read submissions
function getSubmissions() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

// Helper function to write submissions
function saveSubmissions(submissions) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(submissions, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving submissions:', error);
    return false;
  }
}

// API endpoint: Submit adoption request
app.post('/api/adopt', (req, res) => {
  const { name, confirm, consent } = req.body;

  // Validate input
  if (!name || !confirm || !consent) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create new submission
  const submission = {
    id: Date.now(),
    name: name.trim(),
    confirm: confirm === true,
    consent: consent === true,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null
  };

  // Add to submissions
  const submissions = getSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);

  res.json({
    success: true,
    message: 'Thank you! Your adoption request has been submitted. We will review it shortly.',
    id: submission.id
  });
});

// API endpoint: Get all submissions (for admin)
app.get('/api/submissions', (req, res) => {
  const submissions = getSubmissions();
  res.json(submissions);
});

// API endpoint: Get single submission
app.get('/api/submissions/:id', (req, res) => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === parseInt(req.params.id));

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  res.json(submission);
});

// API endpoint: Review submission (approve/reject)
app.post('/api/submissions/:id/review', (req, res) => {
  const { status, reviewer } = req.body;

  // Validate status
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === parseInt(req.params.id));

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  // Update submission
  submission.status = status;
  submission.reviewedAt = new Date().toISOString();
  submission.reviewedBy = reviewer || 'admin';

  saveSubmissions(submissions);

  res.json({
    success: true,
    message: `Submission ${status}`,
    submission
  });
});

// API endpoint: Get statistics
app.get('/api/stats', (req, res) => {
  const submissions = getSubmissions();

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  };

  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`🦛 Adopt a Hippo service running on http://localhost:${PORT}`);
  console.log(`📋 Visit http://localhost:${PORT} to adopt a hippo`);
  console.log(`👨‍⚖️ Visit http://localhost:${PORT}/admin to manage submissions`);
});
