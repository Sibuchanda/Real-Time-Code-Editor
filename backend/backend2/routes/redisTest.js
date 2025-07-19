// backend2/routes/test.js
import express from "express";
import redis from "../config/redis.js";
import { sendMail } from "../utils/emailSender.js";

const router = express.Router();

router.get("/test-otp", async (req, res) => {
  const email = req.query.email;
  const otp = await redis.get(`otp:${email}`);
  res.json({ email, otp });
});


router.get("/set-otp", async (req, res) => {
  const email = req.query.email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates 6-digit OTP

  await redis.set(`otp:${email}`, otp, { ex: 300 }); // expires in 300s (5 mins)
  res.json({ message: "OTP set", email, otp });
});


router.get("/send-otp", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ errors: ["Email is required"] });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  // ---- Store OTP in Redis ----
  try {
    await redis.setex(`otp:${email}`, 120, otp.toString());
    console.log("Generated OTP:", otp);
  } catch (redisErr) {
    console.error("Failed to store OTP in Redis:", redisErr.message);
    return res.status(500).json({
      errors: ["Something went wrong while working with Redis database"],
    });
  }
  // ---- Send OTP via Email ----
  try {
    await sendMail({
      to: email,
      subject: "Welcome to Code Editor",
      text: `Your OTP is: ${otp}. It is valid for 2 minutes.`,
    });
    console.log("OTP sent to email:", email);
    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (emailErr) {
    console.error("Failed to send OTP email:", emailErr.message);
    await redis.del(`otp:${email}`);
    return res.status(500).json({
      errors: ["Failed to send OTP in email."],
    });
  }
});






export default router;
