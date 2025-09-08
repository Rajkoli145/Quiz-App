// src/store/seedQuestions.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);

const questionSchema = new mongoose.Schema({
  category: String,
  subtopic: String,
  question: String,
  options: [String],
  answer: String,
});

const Question = mongoose.model("Question", questionSchema);

// Function to generate 3 sample questions per subtopic
const generateQuestions = (category, subtopic) => [
  {
    category,
    subtopic,
    question: `Sample question 1 for ${subtopic} in ${category}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: "Option A",
  },
  {
    category,
    subtopic,
    question: `Sample question 2 for ${subtopic} in ${category}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: "Option B",
  },
  {
    category,
    subtopic,
    question: `Sample question 3 for ${subtopic} in ${category}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: "Option C",
  },
];

// Subtopics per language
const topics = {
  Java: [
    "Basics & Syntax", "Data Types & Variables", "Operators", "Control Flow (if, switch, loops)",
    "Arrays", "Strings & StringBuilder", "Methods & Recursion", "Object-Oriented Programming",
    "Classes & Objects", "Constructors", "Inheritance", "Polymorphism", "Abstraction",
    "Encapsulation", "Interfaces", "Exception Handling", "Collections Framework", "List, Set, Map",
    "ArrayList, LinkedList, HashMap, HashSet, TreeMap", "Generics", "Multithreading & Concurrency",
    "File I/O", "Java 8 Features (Streams, Lambda Expressions, Functional Interfaces)"
  ],
  C: [
    "Basics & Syntax", "Data Types & Variables", "Operators", "Control Flow (if, switch, loops)",
    "Functions & Recursion", "Arrays", "Strings & String Functions", "Pointers",
    "Structures & Unions", "Dynamic Memory Allocation (malloc, calloc, free)",
    "File Handling", "Preprocessor Directives & Macros", "Bitwise Operators"
  ],
  "C++": [
    "Basics & Syntax", "Data Types & Variables", "Operators", "Control Flow (if, switch, loops)",
    "Functions & Recursion", "Arrays", "Strings & String Class", "Pointers & References",
    "Object-Oriented Programming", "Classes & Objects", "Constructors & Destructors",
    "Inheritance", "Polymorphism", "Encapsulation", "Abstraction", "Operator Overloading",
    "Function Overloading", "Friend Functions", "Templates (Function & Class)",
    "STL (Standard Template Library)", "Vectors, Maps, Sets, Queues, Stacks",
    "Exception Handling", "File Handling"
  ],
  Python: [
    "Basics & Syntax", "Data Types & Variables", "Operators", "Control Flow (if, loops, match-case in Python 3.10+)",
    "Functions & Recursion", "Lists", "Tuples", "Strings", "Dictionaries", "Sets",
    "List Comprehensions", "OOP in Python", "Classes & Objects", "Inheritance", "Polymorphism",
    "Encapsulation", "Exception Handling", "File Handling", "Modules & Packages",
    "Iterators & Generators", "Decorators", "Lambda Functions", "Regular Expressions",
    "Python Libraries (NumPy, Pandas, Matplotlib — optional if quiz extends to applied Python)"
  ]
};

// Generate all questions
let allQuestions = [];
for (let [category, subtopics] of Object.entries(topics)) {
  subtopics.forEach(sub => {
    allQuestions = allQuestions.concat(generateQuestions(category, sub));
  });
}

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not found in .env file");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Question.deleteMany({});
    console.log("🗑️ Cleared old questions");

    await Question.insertMany(allQuestions);
    console.log(`✅ Inserted ${allQuestions.length} questions successfully`);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding questions:", err);
  }
})();
