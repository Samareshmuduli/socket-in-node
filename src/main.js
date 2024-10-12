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
console.log('userSocketMap', userSocketMap)

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
      
      console.log('userSocketMap', userSocketMap)
      const socketId = userSocketMap[data.receieverId]
      console.log('socketIdddddd', socketId)

      if(socketId){
        console.log('socketId111111111111', socketId)
        io.to(socketId).emit("message", message);
        console.log('message---------------', message)
        
      }

      // io.emit('message', data);  
    });
  
    // Handle video call offer
    socket.on('offer', (offer) => {
      // console.log('offerrrrrr', offer)
      // console.log('offer', offer)
      const receiverId = offer.receiverid; // Get the receiver ID from the offer
      // console.log('receiverId2222222222222', receiverId)
      const socketId = userSocketMap[receiverId];
      console.log('socketId========================================', socketId)
      if (socketId) {
          io.to(socketId).emit('offer', offer);
          console.log('offer---------', offer)
      }
  });
  
  

  // Handle video call answer
  socket.on('answer', (answer) => {
    // console.log('answer', answer)
      const  receiverId  = answer.receiverId; // Get the receiver ID from the answer
      
      const socketId = userSocketMap[receiverId];
      if (socketId) {
          io.to(socketId).emit('answer', answer);
          console.log('answer----------', answer)
      }
  });

  // Handle ICE candidate
  socket.on('ice-candidate', (candidate) => {
    // console.log('candidate', candidate)
      const  receiverId  = candidate.receiverId; // Get the receiver ID from the candidate
      const socketId = userSocketMap[receiverId];
      if (socketId) {
          io.to(socketId).emit('ice-candidate', candidate);
          console.log('candidate-----', candidate)
      }
  });

    socket.on('disconnect', () => {
      console.log('a user disconnected!');

       // Remove the user from the userSocketMap
       for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            break;
        }
    }

    });
});

httpServer.listen(port, () => console.log(`Server running on port ${port}`));

