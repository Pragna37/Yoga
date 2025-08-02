import express from "express";
import {
  getPublicSessions,
  getMySessions,
  getSingleSession,
  saveDraftSession,
  publishSession,
} from "../controllers/sessionController.js";
import userAuth from "../middleware/userAuth.js";

const sessionRoutes = express.Router();


sessionRoutes.get("/sessions", getPublicSessions);
sessionRoutes.get("/my-sessions", userAuth, getMySessions);
sessionRoutes.get("/my-sessions/:id", userAuth, getSingleSession);
sessionRoutes.post("/my-sessions/save-draft", userAuth, saveDraftSession);
sessionRoutes.post("/my-sessions/publish", userAuth, publishSession);

export default sessionRoutes;
