import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Mail, Shield, Clock } from 'lucide-react';

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const email = localStorage.getItem("temp-email");
  const navigate = useNavigate();

  // Timer effect for 30-second countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async () => {
    try {
      const { data } = await axios.post("http://localhost:8000/user/verifyotp", { email, otp });
      toast.success(data.message);
      localStorage.removeItem("temp-email");
      navigate("/login");
    } catch (err) {
      const errorData = err?.response?.data?.errors;
      if (Array.isArray(errorData)) errorData.forEach((msg) => toast.error(msg));
      else toast.error("OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      const { data } = await axios.post("http://localhost:8000/user/resendotp", { email });
      toast.success(data.message);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      toast.error("Could not resend OTP. Try again.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <div className="flex items-center justify-center mt-2 text-sm">
            <Mail className="w-4 h-4 text-blue-600 mr-2" />
            <span className="font-medium text-blue-600">{email}</span>
          </div>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <input
            className="w-full p-4 text-center text-xl font-mono border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 tracking-widest"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* Verify Button */}
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-6"
          onClick={handleVerify}
        >
          Verify OTP
        </button>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
          
          {!canResend && (
            <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4 mr-2" />
              <span>Resend available in {formatTime(timer)}</span>
            </div>
          )}
          
          <button
            className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
              canResend
                ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleResend}
          >
            Resend OTP
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;