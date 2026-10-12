import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const prompt1 = new PromptTemplate({
    template: "Write a joke about {topic}",
    inputVariables: ["topic"],
});

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

const parser = new StringOutputParser();

const toTextObject = new RunnableLambda({
    func: async (text: string) => {
        return { text };
    },
});

const prompt2 = new PromptTemplate({
    template: "Explain the following joke - {text}",
    inputVariables: ["text"],
});

const chain = new RunnableSequence({
    first: prompt1,
    middle: [model, parser, toTextObject, prompt2, model],
    last: parser,
});

const result = await chain.invoke({
    topic: "AI",
});

console.log(result);