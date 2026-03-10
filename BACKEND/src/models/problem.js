const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,   
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    tags: {
        type: [String],
        enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking'],
        required: true
    },
    
    visibleTestCases: [
        {   
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
         }
        }
    ],
     hiddenTestCases: [
        {   
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ],

    starterCode: [
        {
            language: {
                type: String,
                //enum: ['javascript', 'python', 'java', 'cpp'],
                required: true
            },
           initialCode: {
                type: String,
                required: true
            } 
        }
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true
            },
           completeCode: {
                type: String,
                required: true
            } 
        }
    ],

    problemCreator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }


})

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;

