// const app = require('express')();
// const httpServer = require('http').createServer(app);
// const {faker}= require('@faker-js/faker')
// const io = require('socket.io')(httpServer, {
//   cors: {origin : '*'}
// });

// const port = 3000;

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('message', (message) => {
//     console.log(message);
//     io.emit('message', `${socket.id.substr(0, 2)}: ${message}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('a user disconnected!');
//   });
// });

// httpServer.listen(port, () => console.log(`listening on port ${port}`));

const express = require("express");
const app = express();  
const httpServer = require('http').createServer(app);
const connectDB = require("./Config/database");
const userRouter = require("./Router/userRouter");
const messageRouter = require("./Router/messageRouter");

const cors = require('cors');
const { userMessage } = require("./controller/messageController");
const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});

const Message = require('../src/model/messageSchema');


app.use(express.json(true));

app.use(cors({
  origin: 'http://localhost:4200'  
}));

app.use('/users', userRouter);
app.use('/message',messageRouter);
const port = 3000;

connectDB();

const userSocketMap = {}

io.on('connection', (socket) => {
  // console.log('socketttttt', socket)
    console.log('a user connected',socket.id);
    console.log('socket.handshake.query.userId', socket.handshake.query.userId)

    const userId = socket.handshake.query.userId
    if(userId)
      userSocketMap[userId] = socket.id
    
    // console.log('userSocketMap', userSocketMap)
  
    socket.on('message', (data) => {
      console.log(data, "logogogog");

      const message = new Message({
        senderId: data.senderId,
        reciverId: data.receieverId,
        message: data.message
      });
      message.save();
      
      const socketId = userSocketMap[data.receieverId]
      console.log('socketIdddddd', socketId)

      if(socketId){
        console.log('socketId111111111111', socketId)
        io.to(socketId).emit("message", message);
      }

      // io.emit('message', data);  
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });
});

httpServer.listen(port, () => console.log(`Server running on port ${port}`));

