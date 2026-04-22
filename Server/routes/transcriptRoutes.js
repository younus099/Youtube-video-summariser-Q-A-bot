import express from "express";
import { getTranscript } from "../controllers/transcriptController.js";

const router = express.Router();

router.post("/", getTranscript);

export default router;