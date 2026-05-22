const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/problem');
const Contest = require('./models/contest');

dotenv.config({ path: './.env' });

const seedContest = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connected to MongoDB for contest seeding...");

    // Find the 4 problems
    const p1 = await Problem.findOne({ title: { $regex: /Longest Substring Without/i } });
    const p2 = await Problem.findOne({ title: { $regex: /Longest Palindromic Substring/i } });
    const p3 = await Problem.findOne({ title: { $regex: /Regular Expression Matching/i } });
    const p4 = await Problem.findOne({ title: { $regex: /Two Sum/i } });

    const problemIds = [];
    if (p1) problemIds.push(p1._id);
    if (p2) problemIds.push(p2._id);
    if (p3) problemIds.push(p3._id);
    if (p4) problemIds.push(p4._id);

    if (problemIds.length < 4) {
      console.warn(`Only found ${problemIds.length} out of 4 problems in DB. Backing up with any available problems...`);
      const allProbs = await Problem.find().limit(4);
      allProbs.forEach(p => {
        if (!problemIds.includes(p._id)) {
          problemIds.push(p._id);
        }
      });
    }

    console.log("Seeding contest with Problem IDs:", problemIds);

    // Delete existing
    await Contest.deleteMany({ title: "CodeOrbit Weekly Challenge #1" });

    // Mock leaderboard
    const mockLeaderboard = [
      {
        rank: 1,
        user: {
          firstName: "Alex",
          lastName: "Rivera",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop",
          username: "arivera"
        },
        score: 350,
        penalty: 32,
        problemsSolved: 4
      },
      {
        rank: 2,
        user: {
          firstName: "Sophia",
          lastName: "Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop",
          username: "schen"
        },
        score: 280,
        penalty: 28,
        problemsSolved: 3
      },
      {
        rank: 3,
        user: {
          firstName: "Liam",
          lastName: "Johnson",
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=80&auto=format&fit=crop",
          username: "ljohnson"
        },
        score: 220,
        penalty: 45,
        problemsSolved: 3
      },
      {
        rank: 4,
        user: {
          firstName: "Emma",
          lastName: "Smith",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&auto=format&fit=crop",
          username: "esmith"
        },
        score: 180,
        penalty: 18,
        problemsSolved: 2
      },
      {
        rank: 5,
        user: {
          firstName: "Olivia",
          lastName: "Taylor",
          avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=80&auto=format&fit=crop",
          username: "otaylor"
        },
        score: 120,
        penalty: 12,
        problemsSolved: 1
      }
    ];

    // Live contest duration 90m
    const startTime = new Date(Date.now() - 20 * 60 * 1000); // 20 mins ago
    const endTime = new Date(Date.now() + 70 * 60 * 1000);  // 70 mins from now

    const newContest = new Contest({
      title: "CodeOrbit Weekly Challenge #1",
      slug: "codeorbit-weekly-challenge-1",
      description: "Welcome to CodeOrbit's flagship weekly programming contest! Test your logical, mathematical, and algorithmic limits across four carefully curated problems ranging from Easy to Hard. Solve them fast to avoid penalty points, climb the live leaderboard, and win exclusive prizes!",
      startTime,
      endTime,
      duration: 90,
      problems: problemIds,
      participants: [],
      leaderboard: mockLeaderboard,
      rewards: {
        coins: 100,
        badges: "Top 3 Badge Rewards"
      },
      status: "live",
      isActive: true
    });

    await newContest.save();
    console.log("Successfully seeded flagship contest 'CodeOrbit Weekly Challenge #1'!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding contest:", error);
    process.exit(1);
  }
};

seedContest();
