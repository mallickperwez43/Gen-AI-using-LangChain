import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
    model: "llama-3.1-8b-instant"
});

const result = await llm.invoke("What is the capital of India?");

console.log(result.content);