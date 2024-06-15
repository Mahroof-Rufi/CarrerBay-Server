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
    
      socket.on('sendMessage', ({sender,receiver,text,createdAt}) => {
        console.log(users);
        
        const receiverData = getUser(receiver)
        const senderData = getUser(sender)
        
        if(receiverData) socketServer.to(receiverData.socketId).emit('message',{sender,receiver,content:text,createdAt})
        if(senderData) socketServer.to(senderData.socketId).emit('message',{sender,receiver,content:text,createdAt})
      });
  
      socket.on("end_session",(receiver)=>{
        const user = getUser(receiver)
        users =  removeUser(receiver)
        if(user){
            socketServer.to(user.socketId).emit("exit_from_chat")
        }
      })
  
      socket.on("call:start",({sender,receiver})=>{      
        const receiverData = getUser(receiver)
        if(receiverData){
            socketServer.to(receiverData.socketId).emit("call:start",sender)
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