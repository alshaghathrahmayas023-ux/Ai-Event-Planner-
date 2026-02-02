require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

async function callOpenAI(message, context) {
    if (!OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY. Set it in your environment.");
    }

    const systemPrompt =
        "You are an intelligent, friendly event planning assistant. " +
        "Provide concise, modern, actionable suggestions. Use bullet points when helpful.";

    const inputText = `Context:\n${context}\n\nUser: ${message}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            input: [
                {
                    role: "system",
                    content: [{ type: "text", text: systemPrompt }]
                },
                {
                    role: "user",
                    content: [{ type: "text", text: inputText }]
                }
            ]
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const outputText = data.output_text || extractOutputText(data);

    return outputText || "I couldn't generate a response. Try again.";
}

function extractOutputText(data) {
    if (!data || !Array.isArray(data.output)) return "";
    for (const item of data.output) {
        if (item.type === "message" && Array.isArray(item.content)) {
            const textParts = item.content
                .filter((c) => c.type === "output_text")
                .map((c) => c.text);
            if (textParts.length) return textParts.join("\n");
        }
    }
    return "";
}

function getContextString(body) {
    const parts = [];
    if (body.budget != null) parts.push(`Budget: ${body.budget}`);
    if (Array.isArray(body.guests)) parts.push(`Guests: ${body.guests.join(", ") || "None"}`);
    if (Array.isArray(body.tasks)) parts.push(`Tasks: ${body.tasks.join(", ") || "None"}`);
    if (Array.isArray(body.categories)) {
        const cats = body.categories.map((c) => `${c.name} (${c.cost})`).join(", ") || "None";
        parts.push(`Categories: ${cats}`);
    }
    return parts.join("\n");
}

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {
    try {
        const payload = req.body || {};
        const context = getContextString(payload.context || {});
        const reply = await callOpenAI(payload.message || "", context);
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
