const mongoose = require('mongoose');

const gameQuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['quiz', 'complexity', 'output', 'bug', 'pattern', 'speed'],
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topic: {
    type: String,
    enum: ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP', 'OS', 'DBMS', 'CN', 'OOP', 'Sorting', 'Recursion', 'LinkedList', 'General'],
    default: 'General'
  },
  question: { type: String, required: true },
  // For quiz / complexity / pattern — multiple choice
  options: [String],
  // Correct answer (string — matches one of options or exact output)
  answer: { type: String, required: true },
  explanation: { type: String, default: '' },
  // For bug hunter — the buggy code block
  codeSnippet: { type: String, default: '' },
  // For speed challenge — expected output or solution hint
  hint: { type: String, default: '' },
  points: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 30 }, // seconds per question
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('GameQuestion', gameQuestionSchema);
