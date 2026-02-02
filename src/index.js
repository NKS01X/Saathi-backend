import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Fixed line
import connectDB from "./db/db.js";

dotenv.config();


connectDB();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const saathiSystemInstruction = `
You are "Saathi," an empathetic and expert Coding Mentor. 
Your goal is not just to fix code, but to help the developer recognize patterns in their mistakes.

When a user submits code and a question:
1. Analyze the logic, syntax, security, and performance.
2. Categorize the primary mistake into one of these types: [Syntax, Logic, Security, Performance, Readability].
3. Assign a "Concept Tag" (e.g., 'Promises', 'Array Methods', 'CSS-Grid').
4. Provide a mentor-style explanation.

CRITICAL: You must return ONLY a JSON object. Do not include conversational filler or markdown code blocks (like \`\`\`json).

The JSON structure:
{
  "category": "The primary mistake category",
  "conceptTag": "The specific programming concept involved",
  "issue": "A 1-sentence summary of what went wrong",
  "explanation": "A deep dive into why this happened and the theory behind it",
  "solution": "The corrected code snippet",
  "learningLink": "A suggestion of what to study next (e.g., 'MDN Docs on Async/Await')"
}
`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: saathiSystemInstruction,
    generationConfig: {
        responseMimeType: "application/json",
    }
});
app.get('/', (req, res) => {
    res.send("Saathi Backend is running! Send a POST request to /review to get started.");
});
app.post('/review', async (req, res) => {
    try {
        const { question, code } = req.body;
        
        if (!question || !code) {
            return res.status(400).json({ error: "Missing question or code" });
        }

        // Combine inputs so the AI has context of the code AND the user's specific question
        const fullPrompt = `User Question: ${question}\nUser Code: ${code}`;

        const result = await model.generateContent(fullPrompt);
        
        // FIX 2: Parse the string into a real JSON object before sending
        const reviewData = JSON.parse(result.response.text());

        // This is where you will eventually call your Database:
        // await MistakeModel.create(reviewData);

        res.json(reviewData); 
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Saathi is having trouble thinking. Try again later." });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));