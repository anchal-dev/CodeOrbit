const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
  try{

    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }

    const userId = req.user._id;
    const problemId = req.params.id;

    let {code,language} = req.body;



    const judgeLanguage = (language === 'cpp') ? 'c++' : language;


    if(!userId||!code||!problemId||!language)
      return res.status(400).send("Some field missing");

    // if( language==='cpp')
    //   language='c++';

    const problem = await Problem.findById(problemId);

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status:'pending',
      testCasesTotal:problem.hiddenTestCases.length
    });

    const languageId = getLanguageById(judgeLanguage);

    const submissions = problem.hiddenTestCases.map((testcase)=>({
      source_code:code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value)=> value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    for(const test of testResult){
      if(test.status_id==3){
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory,test.memory);
      }else{
        status = (test.status_id==4) ? 'error' : 'wrong';
        errorMessage = test.stderr;
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // ✅ FIX HERE
    if(!req.user.problemSolved.includes(problemId)){
      req.user.problemSolved.push(problemId);
      await req.user.save();
    }

    const accepted = (status === 'accepted');

    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });

  } catch(err){
    res.status(500).send("Internal Server Error "+ err);
  }
}

const runCode = async(req,res)=>{
  try{

    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }

    const userId = req.user._id;
    const problemId = req.params.id;

    let {code,language} = req.body;


const judgeLanguage = (language === 'cpp') ? 'c++' : language;


    if(!userId||!code||!problemId||!language)
      return res.status(400).send("Some field missing");

    // if(language==='cpp')
    //   language='c++';

    const problem = await Problem.findById(problemId);

    const languageId = getLanguageById(judgeLanguage);

    const submissions = problem.visibleTestCases.map((testcase)=>({
      source_code:code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value)=> value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
      if(test.status_id==3){
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory,test.memory);
      }else{
        status = false;
        errorMessage = test.stderr;
      }
    }

    res.status(201).json({
      success: status,
      testCases: testResult,
      runtime,
      memory
    });

  } catch(err){
    res.status(500).send("Internal Server Error "+ err);
  }
}

module.exports = {submitCode,runCode};



//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',


// User.findByIdUpdate({
// })

//const user =  User.findById(id)
// user.firstName = "Mohit";
// await user.save();