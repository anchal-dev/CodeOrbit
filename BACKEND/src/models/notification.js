const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who triggered the notification (optional)
    type: { 
        type: String, 
        enum: ['reply', 'mention', 'upvote_post', 'upvote_comment', 'accepted_answer'], 
        required: true 
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the DiscussionPost or Comment
    targetModel: { type: String, enum: ['DiscussionPost', 'Comment'], required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
