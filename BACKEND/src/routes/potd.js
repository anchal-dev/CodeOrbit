const express    = require('express');
const potdRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { optionalMiddleware } = require('../middleware/userMiddleware');
const { getPOTD, claimPOTDReward } = require('../controllers/potd');

// GET /potd — public (auth optional — shows solvedToday if logged in)
potdRouter.get('/', optionalMiddleware, getPOTD);

// POST /potd/reward — protected, called after Accepted submission
potdRouter.post('/reward', userMiddleware, claimPOTDReward);

module.exports = potdRouter;
