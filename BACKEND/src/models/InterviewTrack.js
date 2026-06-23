const mongoose = require('mongoose');

const interviewTrackSchema = new mongoose.Schema({
  trackName: {
    type: String,
    enum: ['dsa', 'os', 'dbms', 'cn', 'oop'],
    required: true,
    unique: true
  },
  title: { type: String, required: true },
  description: { type: String },
  totalQuestions: { type: Number, default: 0 },
  difficulty: { type: String, default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('InterviewTrack', interviewTrackSchema);
