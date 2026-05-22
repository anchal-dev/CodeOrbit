const mongoose = require('mongoose');

const discussionPostSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 200 },
    content: { type: String, required: true }, // Markdown content
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, trim: true }], // e.g., 'Array', 'Interview Experience'
    linkedProblem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }, // Optional link to a problem
    votes: { type: Number, default: 0 }, // Total score (upvotes - downvotes)
    views: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for searching and sorting
discussionPostSchema.index({ title: 'text', content: 'text' });
discussionPostSchema.index({ createdAt: -1 });
discussionPostSchema.index({ votes: -1 });

module.exports = mongoose.model('DiscussionPost', discussionPostSchema);
