import "dotenv/config";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

const prompt = new PromptTemplate({
    template: "Write a summary for the following poem - \n {poem}",
    inputVariables: ["poem"],
});

const parser = new StringOutputParser();

const loader = new TextLoader("cricket.txt");

const docs = await loader.load();

console.log(typeof docs);
console.log(docs.length);
console.log("-------------------------------------------------------------------------------");
console.log(docs[0]?.pageContent);
console.log("-------------------------------------------------------------------------------");
console.log(docs[0]?.pageContent);
console.log("-------------------------------------------------------------------------------");

const chain = prompt.pipe(model).pipe(parser);

const result = await chain.invoke({
    poem: docs[0]?.pageContent,
});

console.log(result);