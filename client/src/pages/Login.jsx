import { useState, useContext } from "react";
import React from 'react';
import axios from 'axios'; // ✅ You missed this import
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext.jsx';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";


import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
     axios.defaults.withCredentials = true;


      if (state === 'Sign Up') {
        const res = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          setIsLoggedIn(true);
          navigate('/feed');
          getUserData();
          toast.success("Registration successful");
        } else {
          toast.error(res.data.message || "Registration failed");
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (res.data.success) {
          setIsLoggedIn(true);
             getUserData();
          navigate('/feed');
       
        } else {
          toast.error(res.data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login/Register Error:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-white-800 text-indigo-400">
          {state === 'Sign Up' ? "Create Account" : 'Login'}
        </h2>
        <p className='text-center text-indigo-400'>
          {state === 'Sign Up' ? "Create your Account" : 'Login to your account'}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={name}
                type="text"
                id="name"
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              type="email"
              id="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {state}
          </button>
        </form>

        <p onClick={() => navigate('/reset-Password')} className='mb-4 text-indigo-500 cursor-pointer p-2'>
          Forgot Password?
        </p>
        {state === 'Sign Up' ? (
          <p className='text-center text-white'>
            Already have an account?{" "}
            <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>
              Login Here
            </span>
          </p>
        ) : (
          <p className='text-center'>
            Don't have an account?{" "}
            <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>
              Signup Here
            </span>
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
