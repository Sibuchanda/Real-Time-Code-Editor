import express from "express";
import axios from "axios";
const AUTH_SERVICE_URL = "http://localhost:8001";

const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/user/signup`, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
     console.log("Error while signup : ",err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/user/login`, req.body);
     res.status(response.status).send(response.data);
  } catch (err) {
     console.log("Error while signIn : ",err);
  }
});

export default app;

