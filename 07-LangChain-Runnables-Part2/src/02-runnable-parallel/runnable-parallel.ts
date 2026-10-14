import "dotenv/config";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel, RunnableSequence } from "@langchain/core/runnables";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const prompt1 = new PromptTemplate({
    template: "Generate a tweet about {topic}",
    inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
    template: "Generate a Linkedin Post about {topic}",
    inputVariables: ["topic"],
});

const model = new ChatGoogle({
    model: "gemini-3.1-flash-lite",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});

const parser = new StringOutputParser();

const parallelChain = new RunnableParallel({
    steps: {
        tweet: new RunnableSequence({
            first: prompt1,
            middle: [model],
            last: parser,
        }),
        linkedin: new RunnableSequence({
            first: prompt2,
            middle: [model],
            last: parser,
        }),
    },
});

const result = await parallelChain.invoke({
    topic: "AI",
});

console.log(result["tweet"]);
console.log("------------------------------------------------------------");
console.log(result["linkedin"]);