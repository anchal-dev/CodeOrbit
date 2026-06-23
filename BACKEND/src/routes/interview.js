const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {
  getTracks,
  getTrackData,
  getCompanyData,
  getExperiences,
  postExperience,
  getProgress,
  toggleQuestionSolved,
  handleMockInterview,
  handleResumeInterview
} = require('../controllers/interviewController');

// Public endpoints
router.get('/tracks', getTracks);
router.get('/track/:trackName', getTrackData);
router.get('/company/:name', getCompanyData);
router.get('/experiences', getExperiences);

// Auth required endpoints
router.post('/experience', userMiddleware, postExperience);
router.get('/progress', userMiddleware, getProgress);
router.post('/solve', userMiddleware, toggleQuestionSolved);
router.post('/mock', userMiddleware, handleMockInterview);
router.post('/resume', userMiddleware, handleResumeInterview);

module.exports = router;
