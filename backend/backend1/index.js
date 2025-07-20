import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import socketHandler from './socket/index.js';
import userRoute from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 8000;

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//Routes
app.use("/user", userRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
