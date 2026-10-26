import "dotenv/config";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const model = new ChatGoogle({
    model: "gemini-3.1-flash-lite",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});

const prompt = new PromptTemplate({
    template: "Answer the following question \n {question} from the following text - \n {text}",
    inputVariables: ["question", "text"],
});

const parser = new StringOutputParser();

const url = "https://en.wikipedia.org/wiki/Cricket";

const loader = new CheerioWebBaseLoader(url);

const docs = await loader.load();

console.log(docs[0]?.pageContent);

console.log("--------------------------------------------------------------------------------------------------------");

const chain = prompt.pipe(model).pipe(parser);

const result = await chain.invoke({
    question: "What is this page about?",
    text: docs[0]?.pageContent,
});

console.log(result);