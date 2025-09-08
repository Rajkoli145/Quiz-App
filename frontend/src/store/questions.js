import express from "express";
import Question from "../models/Question.js"; // your Mongoose model

const router = express.Router();

// Get questions by category & subtopic
router.get("/:category/:subtopic", async (req, res) => {
  try {
    const { category, subtopic } = req.params;
    const questions = await Question.find({ category, subtopic });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
