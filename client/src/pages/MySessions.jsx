import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const MySessions = () => {
  const { backendUrl } = useContext(AppContext);
  const [mySessions, setMySessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/session/my-sessions`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setMySessions(res.data.sessions);
        } else {
          toast.error("Failed to load your sessions.");
        }
      } catch (err) {
        console.error(err);
        toast.error("You must be logged in to view this page.");
        navigate("/login");
      }
    };

    fetchMySessions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6"> My Published Sessions</h2>

        {mySessions.length === 0 ? (
          <p className="text-center text-gray-600">You haven't published any sessions yet.</p>
        ) : (
          <div className="space-y-4">
            {mySessions.map((session) => (
              <div key={session._id} className="border rounded p-4 bg-gray-50 shadow-sm">
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Tags: {session.tags.join(", ")}
                </p>
                <a
                  href={session.json_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View JSON File
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

export default MySessions;
