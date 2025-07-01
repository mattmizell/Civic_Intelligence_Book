import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'civic-intelligence-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const USERS_FILE = path.join(process.cwd(), 'server/data/users.json');
const ANALYTICS_FILE = path.join(process.cwd(), 'server/data/analytics.json');
const PROGRESS_FILE = path.join(process.cwd(), 'server/data/progress.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(path.join(process.cwd(), 'server/data'), { recursive: true });
  } catch (error) {
    console.log('Data directory already exists');
  }
}

// Load or create JSON files
async function loadJsonFile(filePath, defaultData = {}) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

async function saveJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = await loadJsonFile(USERS_FILE, {});
    
    if (users[email]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    
    users[email] = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await saveJsonFile(USERS_FILE, users);

    // Initialize user progress
    const progress = await loadJsonFile(PROGRESS_FILE, {});
    progress[userId] = {
      currentChapter: 0,
      chaptersRead: [],
      timeSpent: 0,
      lastReadAt: new Date().toISOString()
    };
    await saveJsonFile(PROGRESS_FILE, progress);

    const token = jwt.sign({ userId, email, username }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { id: userId, username, email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = await loadJsonFile(USERS_FILE, {});
    const user = users[email];
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await saveJsonFile(USERS_FILE, users);

    const token = jwt.sign({ 
      userId: user.id, 
      email: user.email, 
      username: user.username 
    }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await loadJsonFile(PROGRESS_FILE, {});
    const userProgress = progress[req.user.userId] || {
      currentChapter: 0,
      chaptersRead: [],
      timeSpent: 0,
      lastReadAt: new Date().toISOString()
    };
    
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user progress
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { currentChapter, timeSpent, chapterCompleted } = req.body;
    
    const progress = await loadJsonFile(PROGRESS_FILE, {});
    
    if (!progress[req.user.userId]) {
      progress[req.user.userId] = {
        currentChapter: 0,
        chaptersRead: [],
        timeSpent: 0,
        lastReadAt: new Date().toISOString()
      };
    }

    const userProgress = progress[req.user.userId];
    
    if (currentChapter !== undefined) {
      userProgress.currentChapter = currentChapter;
    }
    
    if (timeSpent !== undefined) {
      userProgress.timeSpent += timeSpent;
    }
    
    if (chapterCompleted !== undefined && !userProgress.chaptersRead.includes(chapterCompleted)) {
      userProgress.chaptersRead.push(chapterCompleted);
    }
    
    userProgress.lastReadAt = new Date().toISOString();
    
    await saveJsonFile(PROGRESS_FILE, progress);
    
    // Update analytics
    const analytics = await loadJsonFile(ANALYTICS_FILE, {
      totalUsers: 0,
      totalSessions: 0,
      totalTimeSpent: 0,
      chapterViews: {},
      dailyStats: {}
    });
    
    analytics.totalSessions += 1;
    analytics.totalTimeSpent += timeSpent || 0;
    
    if (currentChapter !== undefined) {
      analytics.chapterViews[currentChapter] = (analytics.chapterViews[currentChapter] || 0) + 1;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (!analytics.dailyStats[today]) {
      analytics.dailyStats[today] = { sessions: 0, timeSpent: 0, uniqueUsers: new Set() };
    }
    analytics.dailyStats[today].sessions += 1;
    analytics.dailyStats[today].timeSpent += timeSpent || 0;
    analytics.dailyStats[today].uniqueUsers.add(req.user.userId);
    
    // Convert Set to array for JSON serialization
    analytics.dailyStats[today].uniqueUsers = Array.from(analytics.dailyStats[today].uniqueUsers);
    
    await saveJsonFile(ANALYTICS_FILE, analytics);
    
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics (admin only - simplified for demo)
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await loadJsonFile(ANALYTICS_FILE, {
      totalUsers: 0,
      totalSessions: 0,
      totalTimeSpent: 0,
      chapterViews: {},
      dailyStats: {}
    });
    
    const users = await loadJsonFile(USERS_FILE, {});
    analytics.totalUsers = Object.keys(users).length;
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize server
async function startServer() {
  await ensureDataDirectory();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();