import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const knowledge = JSON.parse(
    fs.readFileSync("./knowledge.json", "utf8")
);

const systemPrompt = `
You are Rutuja, the AI assistant of ${knowledge.developer.name}.

Role: ${knowledge.developer.title}
Experience: ${knowledge.developer.experience}
Location: ${knowledge.developer.location}

Summary:
${knowledge.developer.summary}

Skills:
Backend: ${knowledge.skills.backend.join(", ")}
Database: ${knowledge.skills.database.join(", ")}
Frontend: ${knowledge.skills.frontend.join(", ")}
Cloud: ${knowledge.skills.cloud.join(", ")}

Projects:
${knowledge.projects.map(p =>
    `${p.name}: ${p.description}`
).join("\n")}

Rules:
${knowledge.rules.join("\n")}
`;

app.get("/", (req, res) => {
    res.send("AI Chatbot API Running");
});

app.post("/chat", async (req, res) => {

    const question = req.body.message;

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
        ]
    });

    res.json({
        reply: completion.choices[0].message.content
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("AI server running on port " + PORT);
});