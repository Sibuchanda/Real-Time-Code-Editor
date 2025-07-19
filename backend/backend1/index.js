import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socket/index.js';
import userRoute from './routes/user.js'

const PORT = process.env.PORT || 8000;


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use("/user",userRoute);

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});