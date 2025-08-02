import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { AppContext } from "../context/appContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { backendUrl } = useContext(AppContext);
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (res.data.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/session/sessions`);
        if (res.data.success) {
          setSessions(res.data.sessions);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        
        <div className="flex justify-end mb-4 space-x-4">
          <button
            onClick={() => navigate("/mySessions")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            My Sessions
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6"> All Yoga Sessions</h2>

        {sessions.length === 0 ? (
          <p className="text-center text-gray-500">No sessions published yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session._id} className="border rounded p-4 shadow-sm bg-gray-50">
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Tags: {session.tags.join(", ")}</p>
                <a
                  href={session.json_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View JSON file
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
