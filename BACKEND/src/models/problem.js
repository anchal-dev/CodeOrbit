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
        required: true,
        default: []
    },
    companies: {
        type: [String],
        default: []
    },
    acceptanceRate: {
        type: Number,
        default: 100.0
    },
    editorial: {
        type: String,
        default: ""
    },
    videoId: {
        type: String,
        default: ""
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
                default: ''
         }
        }
    ],
    hiddenTestCases: [
        {   
            input: {
                type: String
            },
            output: {
                type: String
            }
        }
    ],

    constraints: {
        type: [String],
        default: []
    },

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

