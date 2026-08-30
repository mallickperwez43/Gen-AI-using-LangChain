import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

// Create terminal input/output interface
const rl = readline.createInterface({
    input,
    output,
});

// Create a chat history
const chatHistory: BaseMessage[] = [
    new SystemMessage("You are a helpful AI assistant")
];
2
while (true) {
    const userInput = await rl.question("You: ");

    chatHistory.push(
        new HumanMessage(userInput)
    );

    if (userInput.toLowerCase() === "exit") {
        break;
    }

    const result = await model.invoke(chatHistory);

    chatHistory.push(
        new AIMessage(String(result.content))
    );

    console.log("AI: ", result.content);
}

rl.close();

console.log("\nChat History:");
console.log(chatHistory);