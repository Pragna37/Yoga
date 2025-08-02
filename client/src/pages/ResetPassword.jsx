import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email: email.trim(),
      });
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      return toast.error("Please fill all fields");
    }
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });
      if (res.data.success) {
        toast.success("Password reset successful");
        setTimeout(() => {
          navigate("/login"); // Redirect to login after success
        }, 2000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-300">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-4 p-3 border border-gray-300 rounded text-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-4 p-3 border border-gray-300 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send OTP"
            : "Reset Password"}
        </button>
      </form>

      {/* ✅ ToastContainer here to isolate toasts on this page */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ResetPassword;
