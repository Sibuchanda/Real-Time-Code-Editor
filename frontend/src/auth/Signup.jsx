import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://localhost:8000",
        {
          username,
          email,
          password,
          confirmpassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message || "User registered successfully");
      navigateTo("/login");
      setUserName("");
      setEmail("");
      setPassword("");
      setconfirmPassword("");
    } catch (err) {
      console.log(err);
      const errorData = err?.response?.data?.errors;

      if (Array.isArray(errorData)) {
        errorData.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData || "User registration failed!!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-6" style={{ backgroundImage: 'url(/images/bg2.png)' }}>
      <div className="w-full max-w-[95%] sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-5 text-blue-800">
          Signup
        </h2>
        <form onSubmit={handleRegister}>
          {/* Username */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 sm:mb-2 font-semibold text-sm sm:text-base">Username</label>
            <input
              className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 sm:mb-2 font-semibold text-sm sm:text-base">Email</label>
            <input
              className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 sm:mb-2 font-semibold text-sm sm:text-base">Password</label>
            <input
              className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 sm:mb-2 font-semibold text-sm sm:text-base">Confirm Password</label>
            <input
              className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              type="password"
              placeholder="Enter confirm password"
              value={confirmpassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 sm:p-3 bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold text-sm sm:text-base cursor-pointer"
          >
            Signup
          </button>

          <p className="mt-3 sm:mt-4 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;