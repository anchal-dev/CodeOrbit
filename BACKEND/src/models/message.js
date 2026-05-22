const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        default: 'global' // Can be 'global' or a private room ID
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
