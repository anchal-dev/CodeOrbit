# 🚀 CodeOrbit — Premium Full-Stack Coding & Interview Prep Platform

**Live Application:** [https://code-orbit-seven.vercel.app/](https://code-orbit-seven.vercel.app/)

CodeOrbit is a state-of-the-art, feature-rich coding ecosystem designed to help developers master algorithms, participate in real-time competitive programming, practice system-level theory, and ace software engineering interviews with the help of custom AI agents.

---

## 🌟 Core Modules & Features

### 1. 🧠 Coding Playground & Problem Solving
*   **Monaco Editor Integration:** A fully interactive, syntax-highlighted IDE built into the browser supporting multiple programming languages.
*   **Test Case Runner:** Run your code against custom test cases and see instant console output.
*   **Judge0 Integration:** Scalable, secure sandboxed execution of code submissions.
*   **Progressive AI Coding Tutor:** A context-aware AI mentor resides inside the playground. It has ambient awareness of the problem description, constraints, and your current code, providing smart, progressive hints without spoiling solutions.

### 2. 🏆 Competitive Programming & Contests
*   **Timed Contests:** Participate in scheduled weekly/bi-weekly competitive programming contests.
*   **Leaderboard Updates:** Real-time ranking calculation based on solve times and scoring weights.
*   **Contest Registration:** Register and compete in an active, locked-down contest environment.

### 3. 🎯 Game Zone (Developer Mini-Games)
An educational gaming suite to master computer science fundamentals:
*   🐛 **Bug Hunter:** Spot and correct logical errors in code snippets within 90 seconds.
*   ⚡ **Speed Challenge:** Solve rapid-fire DSA multiple-choice questions under a strict countdown.
*   🧠 **DSA Quiz Arena:** Comprehensive 10-question tests covering advanced theory (DP, OS, DBMS, OOP, Networking).
*   📈 **Complexity Master:** Read code blocks and predict the correct Big-O time and space complexity.
*   🔍 **Output Predictor:** Walk through dry-runs of complex snippets to predict console outputs.
*   🎯 **Pattern Recognition:** Map problem statements to the correct algorithmic pattern (e.g., Sliding Window, DFS).
*   🏅 **Leaderboards & Achievements:** Track your gaming rank globally and unlock badges (e.g., *Speed Demon*, *Quiz Master*).

### 4. 💼 Interview Preparation Hub
Curated prep tracks designed to clear technical loops:
*   📚 **CS Core Tracks:** Curated, topic-wise practice questions for DSA, OS, DBMS, Computer Networks, and OOP.
*   🏢 **Company Mappings:** Explore and practice questions frequently asked by tech giants like Google, Amazon, Microsoft, and Meta.
*   🤖 **AI Mock Interview Runner:** A chat-based, multi-turn AI interviewer that tests your technical knowledge, scores your performance (communication, technical, confidence), and provides granular feedback.
*   📄 **AI Resume Prep:** Paste or upload your resume; the AI extracts your tech stack and experience to generate personalized mock interview rounds.

### 5. 👥 Discussion Forums & Real-Time Social Hub
*   **Threaded Discussions:** Ask questions, share interview experiences, and discuss complex problems.
*   **Voting & Acceptance:** Upvote valuable posts/comments, and accept answers that solve the thread.
*   **Real-Time Notifications:** Dynamic Socket.IO-powered dropdown alerts users instantly of replies, comments, and milestones.

### 6. 🏪 Achievements & Orbit Coins Redeem Store
*   **Points & Leveling:** Solve challenges, participate in contests, or win mini-games to earn XP and **Orbit Coins**.
*   **Redeem Rewards:** Spend your Orbit Coins in a digital store to unlock developer profile avatars, themes, and badges.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Single Page Application)
*   **Framework:** React 19 (Vite-powered HMR)
*   **Styling:** Tailwind CSS & DaisyUI (Clean, responsive glassmorphic dark theme)
*   **State Management:** Redux Toolkit (Persistent session/auth states)
*   **Real-time Client:** Socket.IO Client
*   **Editor:** Monaco Editor (`@monaco-editor/react`)

### Backend (REST API & WebSockets)
*   **Runtime:** Node.js & Express.js
*   **WebSockets:** Socket.IO (Real-time discussion comments, contest notifications, online presence)
*   **Database:** MongoDB & Mongoose ORM (Users, Problems, Submissions, Forums, Games)
*   **Caching & Blocklist:** Redis Client (Gracefully optional fallback mechanism for blocklisting users)
*   **Auth:** JSON Web Tokens (JWT) stored in Secure, HTTPOnly cookies (`sameSite: "none"` cross-site enabled for production)

---

## 📂 Directory Structure

```text
CodeOrbit/
├── BACKEND/                    # Backend Node.js service
│   ├── src/
│   │   ├── config/             # DB, Redis, and API connections
│   │   ├── controllers/        # Express request logic (Auth, Contests, Games, etc.)
│   │   ├── middleware/         # JWT verification, Admin rules
│   │   ├── models/             # Mongoose schemas (User, Problem, MockInterview, etc.)
│   │   ├── routes/             # API routes
│   │   ├── seeders/            # Database mock-data population scripts
│   │   └── index.js            # Server entry point
│   ├── .env                    # Environment configurations
│   └── package.json
│
└── FRONTEND/                   # Frontend React application
    ├── src/
    │   ├── components/         # Reusable elements (Navbar, IDE, ChatBox, etc.)
    │   ├── pages/              # View screens (Homepage, Games, ContestDetail, etc.)
    │   ├── store/              # Redux slices & store setup
    │   ├── utils/              # Axios instance and shared client configurations
    │   ├── App.jsx             # Routes registration
    │   └── main.jsx            # Entry point
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup & Local Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance
*   Redis Server (Optional, server degradation handles omission gracefully)
*   Judge0 API Key (RapidAPI)

### 1. Clone the repository
```bash
git clone https://github.com/anchal-dev/CodeOrbit.git
cd CodeOrbit
```

### 2. Configure Environment Variables
Create a `.env` file in the `BACKEND` directory:
```env
PORT=3000
DB_CONNECT_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/CodeOrbit
JWT_KEY=your_jwt_secret_key
REDIS_PASS=your_redis_password
JUDGE0_KEY=your_rapidapi_judge0_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Install & Start Backend
```bash
cd BACKEND
npm install
# Seed the database questions if necessary
node src/seeders/interviewSeeder.js
# Start development server
npm start
```

### 4. Install & Start Frontend
```bash
cd ../FRONTEND
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🤝 Contribution & License
Contributions, bug reports, and pull requests are welcome! 

Developed with 💜 by [Anchal Dev](https://github.com/anchal-dev).
