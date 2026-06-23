const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  trackId: {
    type: String,
    enum: ['dsa', 'os', 'dbms', 'cn', 'oop'],
    required: true,
    index: true
  },
  topic: { type: String, required: true, index: true },
  title: { type: String, required: true },
  questionText: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  sampleAnswer: { type: String },
  tips: { type: String },
  companyTags: { type: [String], default: [], index: true }
}, { timestamps: true });

// Compound index for filtering questions within a track or topic quickly
interviewQuestionSchema.index({ trackId: 1, topic: 1 });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
