const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { optionalMiddleware } = require('../middleware/userMiddleware');
const {
    getPosts, getPostById, createPost, createComment,
    vote, acceptAnswer, getNotifications, markNotificationsRead, deletePost
} = require('../controllers/forumController');

router.get('/posts', optionalMiddleware, getPosts);
router.get('/post/:id', optionalMiddleware, getPostById);
router.post('/post', userMiddleware, createPost);
router.delete('/post/:id', userMiddleware, deletePost);
router.post('/comment', userMiddleware, createComment);
router.post('/vote', userMiddleware, vote);
router.post('/post/:id/accept-answer', userMiddleware, acceptAnswer);

router.get('/notifications', userMiddleware, getNotifications);
router.put('/notifications/read', userMiddleware, markNotificationsRead);

module.exports = router;
