const mongoose = require('mongoose');
const { Schema } = mongoose;

const potdSchema = new Schema({
  date: {
    type: String,      // "YYYY-MM-DD" UTC
    required: true,
    unique: true,
    index: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  rewardedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const ProblemOfDay = mongoose.model('ProblemOfDay', potdSchema);
module.exports = ProblemOfDay;
