import User from "../model/user.js";
import { z } from "zod";
import bcrypt from "bcrypt";
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
      // safe parsing the userSchema using 'Zod
      const validation = userSchema.safeParse({
        username,
        email,
        password,
        confirmpassword,
      });
      if (!validation.success) {
        const errorMessage = validation.error.errors.map((err) => err.message);
        return res.status(400).json({ errors: errorMessage });
      }
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: ["User already registered"] });
      }

      //---Generating OTP and Sending ----
      const otpResult = await otpSender(email);
      if (!otpResult.success) {
        return res.status(500).json({ errors: ["OTP sending failed. Please try again."] });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashPassword });
      await newUser.save();

      if (newUser) {
        return res
          .status(201)
          .json({ message: "User registered sucessfully", newUser });
      }
    } else {
      return res
        .status(400)
        .json({ errors: ["Password and Confirm Password should be same"] });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errors: ["Error occured during User Register"] });
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
    const token = await generateToken(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      user: { username: user.username, token },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred during UserLogin" });
  }
};
