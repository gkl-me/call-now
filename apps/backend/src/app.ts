import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { UserManager } from './managers/UserManager';
import cors from 'cors';



dotenv.config()
const app = express();
const PORT = process.env.PORT || 3001
const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin:"*"
  }
})
app.use(cors())

const userManager = new UserManager()

let usercount = 0;

io.on('connection', (socket) => {
  console.log('a user connected',++usercount);

  socket.on('addUser',({name})=>{
    userManager.addUser(name,socket)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected',usercount--);
    userManager.removeUser(socket)
  });
});

app.get('/', (req, res) => {
  res.json({totalUsers:usercount});
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
