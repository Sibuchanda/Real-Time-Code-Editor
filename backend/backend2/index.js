import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/user.js'
import redisTest from './routes/redisTest.js';
import connectDB from './model/connect.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8001;

app.use(express.json());

//Database connection
connectDB(process.env.DB_URL);

app.use("/user",userRoute);
app.use("/test", redisTest);

app.listen(PORT,()=>{
    console.log(`Listening to PORT : ${PORT}`)
})