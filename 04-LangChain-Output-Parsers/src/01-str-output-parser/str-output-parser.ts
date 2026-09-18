import "dotenv/config";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";

const HF_KEY = process.env.HUGGINGFACEHUB_ACCESS_TOKEN;

if (!HF_KEY) {
    throw new Error("No API key found");
}

const model = new HuggingFaceInference({
    model: "mistralai/Mistral-7B-v0.1",
    apiKey: HF_KEY,
    temperature: 0.1,
    maxTokens: 500
});


const template1 = PromptTemplate.fromTemplate("Write a detailed report on {topic}");

const template2 = PromptTemplate.fromTemplate("Write a 5 line summary on the following text. \n {text}");

const strParser = new StringOutputParser();

const convertReportToSummaryInput = RunnableLambda.from<string, { text: string }>(
    (text) => ({ text })
);

const chain = template1
    .pipe(model)
    .pipe(strParser)
    .pipe(convertReportToSummaryInput)
    .pipe(template2)
    .pipe(model)
    .pipe(strParser);

console.log("Running the chain......");

const result = await chain.invoke({ topic: "black hole" });

console.log("\n--- Final Summary ---");
console.log(result);