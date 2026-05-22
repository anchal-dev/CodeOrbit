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
const chatRouter    = require("./routes/chat");
const potdRouter    = require("./routes/potd");
const adminRouter   = require("./routes/admin");
const cookieParser = require('cookie-parser');
const Message = require('./models/message');

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

  socket.on('send_message', async (data) => {
    // Save message to DB
    try {
        const newMessage = new Message({
            room: data.room,
            sender: data.sender._id || data.sender,
            content: data.content
        });
        await newMessage.save();
        
        // Broadcast to others in room
        socket.to(data.room).emit('receive_message', data);
    } catch (err) {
        console.error('Error saving message:', err);
    }
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
    // Allow any localhost origin (handles 5173, 5174, 5175, etc.)
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
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
app.use('/profile', profileRouter);
app.use('/redeem', redeemRouter);
app.use('/contest', contestRouter);
app.use('/api/contest', contestRouter);
app.use('/api/contests', contestRouter);
app.use('/forum', forumRouter);
app.use('/chat',         chatRouter);
app.use('/potd',         potdRouter);
app.use('/announcement', require('./routes/announcement'));
app.use('/admin', adminRouter);
app.use('/api/admin', adminRouter);

const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        
        server.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}

InitalizeConnection();

