import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import Groq from "groq-sdk";
import { register } from "./controllers/register.controller.js";
import { signin } from "./controllers/signin.controller.js";
import { isLoggedIn } from "./middleware/auth.js";
import { Mistake } from "./models/mistake.schema.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

const groq = new Groq({ apiKey: process.env.GROK_KEY });

const saathiSystemInstruction = `
You are "Saathi," an empathetic and expert Coding Mentor. 
Your goal is not just to fix code, but to help the developer recognize patterns in their mistakes.

When a user submits code and a question:
1. Analyze the logic, syntax, security, and performance.
2. Categorize the primary mistake into one of these types: [Syntax, Logic, Security, Performance, Readability].
3. Assign a "Concept Tag" (e.g., 'Promises', 'Array Methods', 'CSS-Grid').
4. Provide a mentor-style explanation.

CRITICAL: You must return ONLY a JSON object. Do not include conversational filler or markdown code blocks.

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

const queue = [];
let isProcessing = false;

async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    const { fullPrompt, req, res } = queue.shift();

    try {
        console.log("SAATHI IS THINKING........");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: saathiSystemInstruction },
                { role: "user", content: fullPrompt }
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.1,                  // Strict
            response_format: { type: "json_object" } // FORCE JSON
        });

        const aiResponse = completion.choices[0]?.message?.content;
        if (!aiResponse) throw new Error("Empty response from Groq");

        const reviewData = JSON.parse(aiResponse);

        // Save to DB
        if (req.user && req.user._id) {
            await Mistake.create({
                userId: req.user._id,
                mistakeCategory: reviewData.category,
                conceptTag: reviewData.conceptTag,
            });
        }

        res.json(reviewData);

    } catch (error) {
        console.error("Groq Error:", error.message);
        res.status(500).json({ error: "Saathi is busy.", details: error.message });
    } finally {
        isProcessing = false;
        processQueue();
    }
}

// --- ROUTES ---
app.get('/', (req, res) => {
    res.send("WELCOME TO SAATHI,CORRECT YOUR SELF WHILE LEARNING");
});
app.post('/register', register);
app.post('/signin', signin);

//gotta check wheather the user is logged in or not 
//if not then redirect it to the homepage 
//gonna let use the guest for one time and then we will force the user to login 

app.post('/review', isLoggedIn, (req, res) => {
    const { question, code } = req.body;
    if (!question || !code) return res.status(400).json({ error: "Missing question or code" });

    const fullPrompt = `User Question: ${question}\nUser Code: ${code}`;

    queue.push({ fullPrompt, req, res });
    processQueue();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
