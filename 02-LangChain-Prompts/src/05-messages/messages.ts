import "dotenv/config";
import { ChatGoogle } from "@langchain/google";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const model = new ChatGoogle({
    model: "gemini-3.5-flash",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});

const messages: BaseMessage[] = [
    new SystemMessage("You are a helpful assistant"),
    new HumanMessage("Tell me about langchain")
];

const result = await model.invoke(messages);

messages.push(
    new AIMessage(String(result.content))
);

console.log(messages);