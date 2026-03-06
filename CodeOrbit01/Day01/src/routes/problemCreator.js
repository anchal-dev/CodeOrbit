const { solidityPacked } = require('ethers');
const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');

const problemRouter = express.Router();
const { createProblem , updateProblem, deleteProblem, getProblemById,getAllProblem,solvedAllProblembyUser} = require('../controllers/userProblem');
const useMiddleware = require('../middleware/userMiddleware');

problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

problemRouter.get("/problemById/:id", useMiddleware, getProblemById);
problemRouter.get("/getAllProblem",useMiddleware,   getAllProblem); 
problemRouter.get("/problemSolvedByUser", useMiddleware, solvedAllProblembyUser);


module.exports = problemRouter;