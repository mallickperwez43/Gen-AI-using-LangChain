import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
});

const result = await model.invoke("Who is the current Prime Minister of India and Who was the first Prime Minister of India?");

console.log(result.content);