const mongoose = require('mongoose');

const interviewProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  solvedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewQuestion'
  }],
  sheetProgress: [{
    sheetId: { type: String, required: true }, // e.g. 'blind75', 'neetcode150'
    solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion' }]
  }],
  mockInterviewCount: { type: Number, default: 0 },
  interviewXP: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InterviewProgress', interviewProgressSchema);
