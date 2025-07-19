import redis from "../config/redis.js";
import { sendMail } from "../utils/emailSender.js";

const otpSender = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await redis.setex(`otp:${email}`, 120, otp.toString());
    console.log("Generated OTP:", otp);
  } catch (redisErr) {
    console.error("Failed to store OTP in Redis:", redisErr.message);
    return { success: false, error: "Redis error" };
  }

  try {
    await sendMail({
      to: email,
      subject: "Welcome to Code Editor",
      text: `Your OTP is: ${otp}. It is valid for 2 minutes.`,
    });
    console.log("OTP sent to email:", email);
    return { success: true };
  } catch (emailErr) {
    console.error("Failed to send OTP email:", emailErr.message);
    await redis.del(`otp:${email}`);
    return { success: false, error: "Email sending failed" };
  }
};

export default otpSender;
