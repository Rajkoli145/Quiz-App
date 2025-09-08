import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Question model
const questionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model("Question", questionSchema);

// API route to fetch questions
app.get("/api/questions/:category/:subtopic", async (req, res) => {
  const { category, subtopic } = req.params;
  try {
    const questions = await Question.find({ category, subtopic });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
