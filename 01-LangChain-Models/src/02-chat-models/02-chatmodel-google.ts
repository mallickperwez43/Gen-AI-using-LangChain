import "dotenv/config";
import { ChatGoogle } from "@langchain/google";

const model = new ChatGoogle({
    model: "gemini-flash-latest",
    temperature: 0.1,
});

const result = await model.invoke("Who is the current Prime Minister of India and Who was the first Prime Minister of India?");

console.log(result.content);