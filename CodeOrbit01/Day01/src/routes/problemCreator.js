const { solidityPacked } = require('ethers');
const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');

const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');

problemRouter.post('/create',adminMiddleware    ,createProblem);
problemRouter.patch('/:id',updateProblem);
problemRouter.delete('/:id',deleteProblem);

problemRouter.get('/:id',getProblemById);
problemRouter.get('/',getAllProblem); 
problemRouter.get("/user",solvedAllProblembyUser);