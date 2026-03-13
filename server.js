import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req,res)=>{
  res.send("AI Chatbot API Running");
});

app.post("/chat", async (req, res) => {

  const question = req.body.message;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are a chatbot answering questions about Sagar Nachankar, a .NET backend developer."
      },
      {
        role: "user",
        content: question
      }
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
