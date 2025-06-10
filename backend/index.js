import express from 'express'
import http from 'http'
import {Server} from 'socket.io'

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection",(socket)=>{
    console.log(`Client Connected.. ID is ${socket.id}`);
})


app.listen(PORT, ()=>{
    console.log(`Listening to PORT ${PORT}...`);
})