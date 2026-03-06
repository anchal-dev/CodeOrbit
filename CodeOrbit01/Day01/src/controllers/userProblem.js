const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");

const createProblem = async (req, res) => {
  try {

    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution
    } = req.body;

    if (!referenceSolution || !visibleTestCases) {
      return res.status(400).send("referenceSolution and visibleTestCases are required");
    }

    for (const { language, completeCode } of referenceSolution) {

      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res.status(400).send("Submission failed");
      }

      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

console.log("Test results for reference solution:", testResult);


      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).send("Reference solution failed test cases");
        }
      }
    }

    await Problem.create({
      ...req.body,
      problemCreator: req.user._id
    });

    res.status(201).send("Problem saved successfully");

  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const updateProblem = async (req, res) => {
    // Implementation for updating a problem  

    const { id } = req.params;
      const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution
    } = req.body;



    try {
    if(!id){
       return  res.status(400).send("Missing problem ID");
    }

    const DsaProblem = await Problem.findById(id);
    if(!DsaProblem){
        return res.status(404).send("Problem Id not found");
    }

    for (const { language, completeCode } of referenceSolution) {

      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res.status(400).send("Submission failed");
      }

      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).send("Reference solution failed test cases");
        }
      }
    }
     
  const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, {runValidators: true,new: true});

  res.status(200).send(newProblem);

      
}
catch (error) {
    res.status(500).send("Error: " + error.message);
}
}

const deleteProblem = async (req, res) => {

    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).send("Missing problem ID");
        }

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).send("Problem is Missing");
        }

        res.status(200).send("Problem deleted successfully");

    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

const getProblemById = async (req, res) => {

    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).send("Missing problem ID");
        }

        const getProblem = await Problem.findById(id).select(' _id title description difficulty tags visibleTestCases  starterCode referenceSolution');

        if (!getProblem) {
            return res.status(404).send("Problem is Missing");
        }

        res.status(200).send(getProblem);

    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

const getAllProblem = async (req, res) => {

    try {

        const getProblem = await Problem.find({}).select(' _id title  difficulty tags ');

        if (getProblem.length === 0) {
            return res.status(404).send("No problems found");
        }

        res.status(200).send(getProblem);

    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

const solvedAllProblembyUser = async (req, res) => {

  try {

    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'problemSolved',
      select: '_id title difficulty tags'
    });

    const count = user.problemSolved.length;

    res.status(200).send({
      
      problems: user.problemSolved
    });

  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }

};

module.exports = {  createProblem, updateProblem, deleteProblem , getProblemById,getAllProblem,solvedAllProblembyUser};