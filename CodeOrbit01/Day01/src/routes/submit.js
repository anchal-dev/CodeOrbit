const express = require('express');
const submissionRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { submitCode , runCode} = require('../controllers/userSubmission');



submissionRouter.post("/submit/:id",userMiddleware, submitCode);
submissionRouter.post("/run/:id",userMiddleware, runCode);

module.exports = submissionRouter;