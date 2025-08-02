import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../context/appContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [jsonUrl, setJsonUrl] = useState("");
  const [sessionId, setSessionId] = useState(null);

  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!userData || (!title && !tags && !jsonUrl)) return;

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      saveDraft(true);
    }, 5000);

    return () => clearTimeout(typingTimeoutRef.current);
  }, [title, tags, jsonUrl, userData]);

  const saveDraft = async (auto = false) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/session/my-sessions/save-draft`,
        {
          sessionId,
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonUrl,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSessionId(res.data.session._id);
        if (!auto) toast.success("Draft saved!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft");
    }
  };

  const publish = async () => {
    try {
      if (!sessionId) {
        toast.warning("Please save the draft first");
        return;
      }

      const res = await axios.post(
        `${backendUrl}/api/session/my-sessions/publish`,
        { sessionId },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Session published!");
        setTitle("");
        setTags("");
        setJsonUrl("");
        setSessionId(null);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish session");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Create a Wellness Session
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Session Title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <input
            type="text"
            placeholder="JSON File URL"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={jsonUrl}
            onChange={(e) => setJsonUrl(e.target.value)}
          />

          <div className="flex gap-4 pt-4">
            <button
              className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              onClick={() => saveDraft(false)}
            >
              Save Draft
            </button>
            <button
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              onClick={publish}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Feed;
