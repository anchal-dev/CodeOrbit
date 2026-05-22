const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of DiscussionPost or Comment
    targetModel: { type: String, required: true, enum: ['DiscussionPost', 'Comment'] },
    voteType: { type: Number, required: true, enum: [1, -1] }, // 1 for upvote, -1 for downvote
}, { timestamps: true });

// Prevent multiple votes from the same user on the same target
voteSchema.index({ userId: 1, targetId: 1, targetModel: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
