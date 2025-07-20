import redisClient from "../config/redis.js";
import User from "../model/user.js";
import otpSender from "./otpSender.js";

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ errors: ["Email and OTP are required"] });
  }

  try {
    const savedOtp = await redisClient.get(`otp:${email}`);
    if (!savedOtp || String(savedOtp).trim() !== String(otp).trim()) {
      return res.status(400).json({ errors: ["Invalid or expired OTP"] });
    }

    const userData = await redisClient.get(`temp-user:${email}`);
    if (!userData) {
      return res
        .status(400)
        .json({ errors: ["User data expired. Please register again."] });
    }

    let parsedUser;
    try {
      if (typeof userData === "string") {
        parsedUser = JSON.parse(userData);
      } else {
        parsedUser = userData;
      }
    } catch (err) {
      return res.status(500).json({ errors: ["Corrupted user session data."] });
    }

    const newUser = new User({
      username: parsedUser.username,
      email: parsedUser.email,
      password: parsedUser.password,
    });
    await newUser.save();

    await redisClient.del(`otp:${email}`);
    await redisClient.del(`temp-user:${email}`);

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errors: ["Verification failed. Try again."] });
  }
};

// ---Resend OTP -----
export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ errors: ["Email is required"] });
  }

  const userData = await redisClient.get(`temp-user:${email}`);
  if (!userData) {
    return res
      .status(400)
      .json({ errors: ["Session expired. Please register again."] });
  }

  const otpResult = await otpSender(email);
  if (!otpResult.success) {
    return res
      .status(500)
      .json({ errors: ["Failed to resend OTP. Try again later."] });
  }
  return res.status(200).json({ message: "OTP resent successfully." });
};
