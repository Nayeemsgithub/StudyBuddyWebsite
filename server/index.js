import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CounselingRequest from './models/CounselingRequest.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studybuddy';

app.use(cors());
app.use(express.json());

// In-memory fallback store if MongoDB is not running locally
const memoryStore = [];
let isMongoConnected = false;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000,
})
.then(() => {
  isMongoConnected = true;
  console.log('✅ Connected to MongoDB database: studybuddy');
})
.catch((err) => {
  isMongoConnected = false;
  console.log('⚠️ MongoDB connection offline (using fallback in-memory store):', err.message);
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    brand: 'Study Buddy',
    database: isMongoConnected ? 'MongoDB Connected' : 'In-Memory Store Active',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/counseling', async (req, res) => {
  try {
    const { name, email, phone, destination, questions } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and phone number are required.' });
    }

    const payload = {
      name,
      email,
      phone,
      destination: destination || 'General Inquiry',
      questions: questions || 'No questions specified',
      status: 'Pending',
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      const newRequest = new CounselingRequest(payload);
      await newRequest.save();
      return res.status(201).json({
        success: true,
        message: 'Counseling request saved to MongoDB successfully!',
        data: newRequest,
      });
    } else {
      memoryStore.push(payload);
      return res.status(201).json({
        success: true,
        message: 'Counseling request received successfully!',
        data: payload,
      });
    }
  } catch (error) {
    console.error('Error handling counseling request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/counseling', async (req, res) => {
  try {
    if (isMongoConnected) {
      const requests = await CounselingRequest.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    } else {
      return res.json({ success: true, count: memoryStore.length, data: memoryStore });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching requests' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 StudyBuddy Express MERN Server running at http://localhost:${PORT}`);
});
