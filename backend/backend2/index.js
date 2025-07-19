import express from 'express';
import userRoute from './routes/user.js'
import redisTest from './routes/redisTest.js';
const PORT = process.env.PORT || 8001;

const app= express();

app.use("/user",userRoute);
app.use("/test", redisTest);

app.listen(PORT,()=>{
    console.log(`Listening to PORT : ${PORT}`)
})