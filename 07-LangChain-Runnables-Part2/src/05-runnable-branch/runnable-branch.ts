import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableLambda, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const wordCount = (text: string): number => {
    return text.split(/\s+/).length;
};

const longReportCondition = new RunnableLambda<string, boolean>({
    func: async (input: string) => wordCount(input) > 500,
});

const toTextObject = new RunnableLambda<string, { text: string }>({
    func: async (input: string) => ({
        text: input
    }),
});

const prompt1 = new PromptTemplate({
    template: "Write a detailed report on {topic}",
    inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
    template: "Summarize the following text \n {text}",
    inputVariables: ["text"],
});

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

const parser = new StringOutputParser();

const reportGenChain = new RunnableSequence({
    first: prompt1,
    middle: [model],
    last: parser,
});

const branchChain = new RunnableBranch({
    branches: [
        [
            longReportCondition,
            new RunnableSequence({
                first: toTextObject,
                middle: [prompt2, model],
                last: parser,
            }),
        ],
    ],

    default: new RunnablePassthrough<string>(),
});

const finalChain = new RunnableSequence({
    first: reportGenChain,
    last: branchChain,
});

const result = await finalChain.invoke({
    topic: "Russia vs Ukraine",
});

console.log(result);