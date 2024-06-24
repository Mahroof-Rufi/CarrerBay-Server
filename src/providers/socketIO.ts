import http from 'http'
import { Server } from 'socket.io';
import { createServer } from '../infrastructure/config/app'

const server = http.createServer(createServer())

const socketServer = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
});

interface Users {
  userId: string;
  socketId:string
}
  
  let users:Users[] = []
  
  const addUser = (userId:string,socketId:string)=>{
    const exists = users.find(user => user.userId === userId)
    if(exists){
      exists.socketId = socketId
    }else{
      users.push({userId,socketId})
    }
  }
  
  const getUser = (userId: string) => users.find(user => user.userId === userId)
  const removeUser = (userId:string) => users = users.filter(user => user.userId !== userId)
  
  socketServer.on('connection', (socket) => { 
  
      socket.on("add_user", (userId) => {
        addUser(userId,socket.id)
      })
  
      socket.on("chat:started",({to})=>{
        const user = getUser(to)
        if(user){
          socketServer.to(user.socketId).emit("chat:started")
        }
      })
    
      socket.on('sendMessage', ({ _id = '',sender, receiver, text = '', type, isMediaFile, createdAt, employer,interviewDate, interviewTime, status }) => {
        try {
            const receiverData = getUser(receiver);
            const senderData = getUser(sender);
            
            const messageData = {
                _id,
                sender,
                receiver,
                isMediaFile,
                content: text,
                type,
                interviewDetails: {
                    employer: employer,
                    interviewDate,
                    interviewTime,
                    status
                },
                createdAt
            };
    
            if (receiverData) {
                socketServer.to(receiverData.socketId).emit('message', messageData);
                console.log(`Message sent to receiver: ${receiverData.socketId}`);
            }
    
            if (senderData) {
                socketServer.to(senderData.socketId).emit('message', messageData);
                console.log(`Message sent to sender: ${senderData.socketId}`);
            } else {
              console.log('kkkk');
              
            }
        } catch (error) {
            console.error('Error in sendMessage:', error);
        }
    });

    socket.on('delete-message', ({ deletedMessageId , receiverId }) => {
      try {          
          const receiverData = getUser(receiverId);
  
          if (receiverData) {
              socketServer.to(receiverData.socketId).emit('deleted-message', deletedMessageId);
          }
      } catch (error) {
          console.error('Error in sendMessage:', error);
      }
  });
    
  
      socket.on("end_session",(receiver)=>{
        const user = getUser(receiver)
        users =  removeUser(receiver)
        if(user){
            socketServer.to(user.socketId).emit("exit_from_chat")
        }
      })  
  
      socket.on('disconnect', () => {
        // console.log('User disconnected');
      });
  
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
  
  });

export default server