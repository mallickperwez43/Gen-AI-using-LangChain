import "dotenv/config";
import Groq from "groq-sdk";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const groq = new Groq({
    apiKey: GROQ_KEY,
});

const models = await groq.models.list();

for (const model of models.data) {
    console.log(model.id);
}