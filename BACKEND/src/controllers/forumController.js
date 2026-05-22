const DiscussionPost = require('../models/discussionPost');
const Comment = require('../models/comment');
const Vote = require('../models/vote');
const Notification = require('../models/notification');
const User = require('../models/user');
const mongoose = require('mongoose');

// Helper to send notifications via socket
const sendNotification = async (req, receiverId, senderId, type, targetId, targetModel) => {
    if (String(receiverId) === String(senderId)) return; // Don't notify oneself

    const notification = await Notification.create({
        userId: receiverId,
        senderId,
        type,
        targetId,
        targetModel
    });

    const populatedNotification = await Notification.findById(notification._id)
        .populate('senderId', 'firstName lastName avatar');

    if (req.io) {
        req.io.to(String(receiverId)).emit('notification', populatedNotification);
    }
};

const getPosts = async (req, res) => {
    try {
        const { filter, tag, problemId, page = 1, limit = 10, search } = req.query;
        let query = {};

        if (tag) query.tags = { $regex: new RegExp(`^${tag}$`, 'i') };
        if (problemId) query.linkedProblem = problemId;
        if (search) query.$text = { $search: search };
        
        if (filter === 'unanswered') query.commentsCount = 0;
        if (filter === 'solved') query.acceptedAnswer = { $exists: true, $ne: null };

        let sortOpts = { isPinned: -1 }; // Always show pinned first
        if (filter === 'trending' || filter === 'most_upvoted') {
            sortOpts.votes = -1;
        } else {
            sortOpts.createdAt = -1; // Newest by default
        }

        const posts = await DiscussionPost.find(query)
            .sort(sortOpts)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('author', 'firstName lastName avatar reputation')
            .populate('linkedProblem', 'title');

        const total = await DiscussionPost.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await DiscussionPost.findById(req.params.id)
            .populate('author', 'firstName lastName avatar reputation')
            .populate('linkedProblem', 'title difficulty');

        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Increment view count
        post.views += 1;
        await post.save();

        // Fetch comments (top level only, threaded loading can be done or nested)
        const comments = await Comment.find({ postId: post._id })
            .populate('author', 'firstName lastName avatar reputation')
            .sort({ votes: -1, createdAt: 1 })
            .lean();

        // Build comment tree
        const commentMap = {};
        const rootComments = [];

        comments.forEach(c => {
            c.replies = [];
            commentMap[c._id.toString()] = c;
        });

        comments.forEach(c => {
            if (c.parentComment) {
                const parent = commentMap[c.parentComment.toString()];
                if (parent) parent.replies.push(c);
            } else {
                rootComments.push(c);
            }
        });

        res.status(200).json({ post, comments: rootComments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, tags, linkedProblem } = req.body;
        const post = new DiscussionPost({
            title,
            content,
            tags,
            linkedProblem: linkedProblem || undefined,
            author: req.user._id
        });

        await post.save();
        const populatedPost = await DiscussionPost.findById(post._id).populate('author', 'firstName lastName avatar reputation');
        
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createComment = async (req, res) => {
    try {
        const { postId, content, parentComment } = req.body;
        
        const post = await DiscussionPost.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.isLocked) return res.status(403).json({ error: 'Post is locked' });

        const comment = new Comment({
            postId,
            content,
            parentComment: parentComment || null,
            author: req.user._id
        });

        await comment.save();
        
        post.commentsCount += 1;
        await post.save();

        const populatedComment = await Comment.findById(comment._id).populate('author', 'firstName lastName avatar reputation');

        // Notify
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (parent) {
                await sendNotification(req, parent.author, req.user._id, 'reply', comment._id, 'Comment');
            }
        } else {
            await sendNotification(req, post.author, req.user._id, 'reply', post._id, 'DiscussionPost');
        }

        // Realtime update
        if (req.io) {
            req.io.to(`post_${postId}`).emit('new_comment', populatedComment);
        }

        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const vote = async (req, res) => {
    try {
        const { targetId, targetModel, voteType } = req.body; // voteType: 1 or -1
        
        if (![1, -1].includes(voteType)) return res.status(400).json({ error: 'Invalid voteType' });
        
        const Model = targetModel === 'DiscussionPost' ? DiscussionPost : Comment;
        const target = await Model.findById(targetId);
        
        if (!target) return res.status(404).json({ error: 'Target not found' });

        const existingVote = await Vote.findOne({ userId: req.user._id, targetId, targetModel });

        let voteDiff = 0;

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // User is un-voting
                await Vote.findByIdAndDelete(existingVote._id);
                voteDiff = -voteType;
            } else {
                // User is switching vote
                existingVote.voteType = voteType;
                await existingVote.save();
                voteDiff = voteType * 2;
            }
        } else {
            // New vote
            await Vote.create({ userId: req.user._id, targetId, targetModel, voteType });
            voteDiff = voteType;
        }

        target.votes += voteDiff;
        await target.save();

        // Update target author's reputation
        if (voteDiff > 0 && String(target.author) !== String(req.user._id)) {
            await User.findByIdAndUpdate(target.author, { $inc: { reputation: voteDiff === 2 ? 2 : 1 } });
            if (voteType === 1 && !existingVote) {
                await sendNotification(req, target.author, req.user._id, `upvote_${targetModel.toLowerCase()}`, targetId, targetModel);
            }
        } else if (voteDiff < 0 && String(target.author) !== String(req.user._id)) {
            await User.findByIdAndUpdate(target.author, { $inc: { reputation: voteDiff === -2 ? -2 : -1 } });
        }

        if (req.io) {
            const room = targetModel === 'DiscussionPost' ? `post_${targetId}` : `post_${target.postId}`;
            req.io.to(room).emit('vote_update', { targetId, targetModel, newScore: target.votes });
        }

        res.status(200).json({ newScore: target.votes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const acceptAnswer = async (req, res) => {
    try {
        const { postId, commentId } = req.body;
        
        const post = await DiscussionPost.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        if (String(post.author) !== String(req.user._id)) {
            return res.status(403).json({ error: 'Only post author can accept an answer' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment || String(comment.postId) !== String(postId)) {
            return res.status(404).json({ error: 'Comment not found on this post' });
        }

        if (post.acceptedAnswer) {
            // Un-accept previous answer
            await Comment.findByIdAndUpdate(post.acceptedAnswer, { isAccepted: false });
        }

        comment.isAccepted = true;
        await comment.save();

        post.acceptedAnswer = comment._id;
        await post.save();

        // Give reputation points for accepted answer
        if (String(comment.author) !== String(req.user._id)) {
            await User.findByIdAndUpdate(comment.author, { $inc: { reputation: 10 } });
            await sendNotification(req, comment.author, req.user._id, 'accepted_answer', commentId, 'Comment');
        }

        if (req.io) {
            req.io.to(`post_${postId}`).emit('answer_accepted', { commentId });
        }

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('senderId', 'firstName lastName avatar');
            
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await DiscussionPost.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Not found' });
        
        if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        await DiscussionPost.findByIdAndDelete(post._id);
        await Comment.deleteMany({ postId: post._id });
        await Vote.deleteMany({ targetId: post._id, targetModel: 'DiscussionPost' });
        
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getPosts, getPostById, createPost, createComment,
    vote, acceptAnswer, getNotifications, markNotificationsRead, deletePost
};
