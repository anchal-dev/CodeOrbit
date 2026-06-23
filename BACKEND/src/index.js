const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter  = require("./routes/submit");
const profileRouter = require("./routes/profile");
const redeemRouter  = require("./routes/redeem");
const contestRouter = require("./routes/contest");
const forumRouter   = require("./routes/forum");
const potdRouter    = require("./routes/potd");
const gameRouter    = require('./routes/game');
const interviewRouter = require('./routes/interview');
const adminRouter   = require("./routes/admin");
const cookieParser = require('cookie-parser');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Pass io to request object if needed by routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

app.use(cookieParser()); // ✅ VERY IMPORTANT
const cors = require("cors");
const aiRouter = require('./routes/aiChatting');

app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost (development) and any vercel.app domains (production)
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use('/api/ai',aiRouter);
app.use('/profile', profileRouter);
app.use('/redeem', redeemRouter);
app.use('/contest', contestRouter);
app.use('/api/contest', contestRouter);
app.use('/api/contests', contestRouter);
app.use('/forum', forumRouter);
app.use('/potd',         potdRouter);
app.use('/game',         gameRouter);
app.use('/api/game',     gameRouter);
app.use('/interview',     interviewRouter);
app.use('/api/interview', interviewRouter);
app.use('/announcement', require('./routes/announcement'));
app.use('/admin', adminRouter);
app.use('/api/admin', adminRouter);

const InitalizeConnection = async ()=>{
    try{

        await main();
        console.log("DB Connected");

        // Redis connect is non-blocking (safeRedis handles failures gracefully)
        redisClient.connect();
        
        server.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}

InitalizeConnection();

