import Session from "../models/sessionModel.js";

export const getPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.userId,
    });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveDraftSession = async (req, res) => {
  const { sessionId, title, tags, json_file_url } = req.body;

  try {
    let session;
    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user.userId },
        { title, tags, json_file_url, status: "draft" },
        { new: true }
      );
    } else {
      session = await Session.create({
        user_id: req.user.userId,
        title,
        tags,
        json_file_url,
        status: "draft",
      });
    }
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.user.userId },
      { status: "published" },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
