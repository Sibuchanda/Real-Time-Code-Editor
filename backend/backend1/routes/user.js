import express from "express";
import axios from "axios";
const AUTH_SERVICE_URL = "http://localhost:8001";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/user/signup`,
      req.body
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    const statusCode = err.response?.status || 500;
    const backendError = err.response?.data?.errors || ["Signup failed"];
    res.status(statusCode).send({ errors: backendError });
  }
});

router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/user/login`,
      req.body
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log("Error while signIn : ", err);
    res.status(500).send({ error: "Login failed" });
  }
});

router.post("/verifyotp", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/user/verifyotp`,
      req.body
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    const statusCode = err.response?.status || 500;
    const backendError = err.response?.data?.errors || ["OTP verification failed"];
    res.status(statusCode).send({ errors: backendError });
  }
});

router.post("/resendotp", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/user/resendotp`,
      req.body
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log("Resending OTP error : ", err);
    res.status(400).send({ error: "Resend OTP failed" });
  }
});

export default router;
