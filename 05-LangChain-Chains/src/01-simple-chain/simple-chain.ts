import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const template = new PromptTemplate({
    template: `Generate 5 intersting facts about {topic}`,
    inputVariables: ["topic"],
});

const modelGroq = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    apiKey: GROQ_KEY,
});

const modelGoogle = new ChatGoogle({
    model: "gemini-3.5-flash-lite",
    temperature: 0.2,
    apiKey: GOOGLE_KEY,
});

const parser = new StringOutputParser();

const chainOne = template.pipe(modelGroq).pipe(parser);

const chainTwo = template.pipe(modelGoogle).pipe(parser);

const resultOne = await chainOne.invoke({
    topic: "cricket",
});

const resultTwo = await chainTwo.invoke({
    topic: "cricket",
});

console.log(resultOne);
console.log("\n ------------------------Groq Chain Graph-------------------------------------");
console.log(chainOne.getGraph().drawMermaid());
console.log("\n ------------------------------------------------------------------------------");
console.log(resultTwo);
console.log("\n ------------------------Google Chain Graph-------------------------------------");
console.log(chainTwo.getGraph().drawMermaid());
