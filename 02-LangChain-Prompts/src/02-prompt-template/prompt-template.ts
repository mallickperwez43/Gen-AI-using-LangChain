import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}


const modelGoogle = new ChatGoogle({
    model: "gemini-3.5-flash",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});

const modelGroq = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

// make a template
const currTemplate = new PromptTemplate({
    template: `Greet this person in 5 languages. The name of the person is {name}`,
    inputVariables: ["name"],
});

// Fill in the template with the value of name
const prompt = await currTemplate.invoke({
    name: "Alex"
});


// call the model and get the result
const resultGoole = await modelGoogle.invoke(prompt);

console.log(resultGoole.content);

console.log("-------------------------------------------------------------------------------");

const resultGroq = await modelGroq.invoke(prompt);

console.log(resultGroq.content);