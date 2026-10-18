import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableParallel, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

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

const prompt2 = new PromptTemplate({
    template: "Explain the following joke - {text}",
    inputVariables: ["text"],
});

const toTextObject = new RunnableLambda({
    func: async (text: string) => {
        return { text };
    },
});

const jokeGenChain = new RunnableSequence({
    first: prompt1,
    middle: [model],
    last: parser,
});

const parallelChain = new RunnableParallel({
    steps: {
        joke: new RunnablePassthrough(),
        explanation: new RunnableSequence({
            first: toTextObject,
            middle: [prompt2, model],
            last: parser,
        }),
    },
});

const finalChain = new RunnableSequence({
    first: jokeGenChain,
    last: parallelChain,
});

const result = await finalChain.invoke({
    topic: "cricket",
});

console.log(result);