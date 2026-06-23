const mongoose = require('mongoose');

const interviewExperienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: { type: String, required: true, index: true },
  role: { type: String, required: true },
  year: { type: Number, required: true },
  questionsAsked: [{ type: String, required: true }],
  tips: { type: String },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  verdict: {
    type: String,
    enum: ['Selected', 'Rejected', 'No Offer'],
    default: 'Selected'
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);
