import mongoose from 'mongoose';

const CounselingRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  destination: { type: String, default: 'General Inquiry' },
  questions: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CounselingRequest || mongoose.model('CounselingRequest', CounselingRequestSchema);
