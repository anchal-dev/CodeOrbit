const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionPost', required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // For threaded replies
    content: { type: String, required: true }, // Markdown content
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    votes: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false }, // Accepted answer by post author
}, { timestamps: true });

// Indexes
commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('Comment', commentSchema);
