import User from "../model/user.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";
import otpSender from "./otpSender.js";

//---------------- Validating User Schema using 'Zod'-----------
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username should be at least 3 character long" })
    .max(35),
  password: z
    .string()
    .min(8, { message: "Password length should be at least 8 character long" })
    .max(25, {
      message: "Password length should be maximum 25 character long",
    }),
  confirmpassword: z
    .string()
    .min(8, { message: "Password length should be at least 8 character long" })
    .max(25, {
      message: "Password length should be maximum 25 character long",
    }),
});

// ========================Register a new user=====================
export const signup = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if (!username || !email || !password) {
      return res.status(400).json({ errors: ["All fields are required"] });
    }
    if (password === confirmpassword) {
      const validation = userSchema.safeParse({
        username,
        email,
        password,
        confirmpassword,
      });

      if (!validation.success) {
        const errorMessage = validation.error?.errors?.map(
          (err) => err.message
        );
        return res.status(400).json({ errors: errorMessage });
      }
      //Verifying new user or not---
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: ["User already registered"] });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const tempUserData = JSON.stringify({
        username,
        email,
        password: hashPassword,
      });
      await redisClient.set(`temp-user:${email}`, tempUserData, { EX: 300 }); // store for 5 minutes
      //---Generating OTP and Sending ----
      const otpResult = await otpSender(email);
      if (!otpResult.success) {
        return res
          .status(500)
          .json({ errors: ["OTP sending failed. Please try again."] });
      }
      return res
        .status(200)
        .json({ message: "OTP sent to your email. Please verify." });
    } else {
      res
        .status(400)
        .json({ errors: "Password and Confirm password should be same" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errors: ["Something went wrong during signup."] });
  }
};

// ========================== Login a user =====================
export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid user details" });
    }
    // const token = await generateToken(user._id, res);
    // res.status(200).json({
    //   message: "User logged in successfully",
    //   user: { username: user.username, token },
    // });
    return res.status(200).json({
      message: "User Logged in successfully",
      user: { username: user.username },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred during UserLogin" });
  }
};
