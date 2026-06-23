const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mode: {
    type: String,
    enum: ['dsa', 'frontend', 'backend', 'fullstack', 'core', 'behavioral', 'resume'],
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  chatHistory: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  scores: {
    communication: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  feedback: { type: String },
  suggestions: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
