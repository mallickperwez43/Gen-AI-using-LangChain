import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const template1 = new PromptTemplate({
    template: `Generate a detailed report on {topic}`,
    inputVariables: ["topic"],
});

const template2 = new PromptTemplate({
    template: `Generate a 5 pointer summary from the following text \n {text}`,
    inputVariables: ["text"],
});

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

const parser = new StringOutputParser();

const toTextObject = new RunnableLambda<string, { text: string }>({
    func: async (text: string) => ({
        text,
    }),
});

const chain = template1.pipe(model).pipe(parser).pipe(toTextObject).pipe(template2).pipe(model).pipe(parser);

const result = await chain.invoke({
    topic: "Unemployment in India"
});

console.log(result);

console.log(chain.getGraph().drawMermaid());