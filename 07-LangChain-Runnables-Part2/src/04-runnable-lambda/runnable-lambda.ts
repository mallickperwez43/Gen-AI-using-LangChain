import "dotenv/config";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableParallel, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const wordCount = (text: string): number => {
    return text.split(/\s+/).length;
};

const prompt = new PromptTemplate({
    template: "Write a joke about {topic}",
    inputVariables: ["topic"],
});

const model = new ChatGoogle({
    model: "gemini-3.1-flash-lite",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});


const parser = new StringOutputParser();

const jokeGenChain = new RunnableSequence({
    first: prompt,
    middle: [model],
    last: parser,
});

const parallelChain = new RunnableParallel({
    steps: {
        joke: new RunnablePassthrough(),
        word_count: new RunnableLambda({
            func: wordCount
        }),
    },
});

const finalChain = new RunnableSequence({
    first: jokeGenChain,
    last: parallelChain,
});

const result = await finalChain.invoke({
    topic: "AI",
});

const finalResult = `${result.joke}
word count - ${result.word_count}`;

console.log(finalResult);