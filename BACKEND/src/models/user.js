 const mongoose = require('mongoose');
 const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
       // required: true,
        minLength: 3,
        maxLength: 20
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase: true,
        immutable: true

    },
    age:{
        type: Number,
        min: 6,
        max: 80

    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
  problemSolved: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "Problem",
  default: []
  },
  points: {
      type: Number,
      default: 0
  },
  redeemHistory: [{
      item: String,
      cost: Number,
      date: { type: Date, default: Date.now }
  }],
  avatar: {
      type: String,
      default: ""
  },
  github: {
      type: String,
      default: ""
  },
  linkedin: {
      type: String,
      default: ""
  },
  bio: {
      type: String,
      default: "",
      maxLength: 500
  },
  contestsParticipated: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest"
  }],
  orbitCoins: {
      type: Number,
      default: 0
  },
  reputation: {
      type: Number,
      default: 0
  },
  dailySolvedProblems: [{
      problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
      date:      { type: String },   // 'YYYY-MM-DD' UTC
      solvedAt:  { type: Date, default: Date.now }
  }],
  password: {
        type: String,
        required: true,
    }


},{
    timestamps: true
});


userSchema.post('findOneAndDelete', async function(userInfo) {
    if (userInfo) {
        const userId = userInfo._id;
        await mongoose.model('Submission').deleteMany({ userId });
    }
});




const User = mongoose.model('User', userSchema);

module.exports = User;
