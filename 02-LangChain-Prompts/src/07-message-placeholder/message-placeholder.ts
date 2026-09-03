import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import fs from "fs";
import path from "path";

// load chat history ... (get from database)
const filePath = path.join(import.meta.dirname, "chat-history.txt");
const chatHistory = fs.readFileSync(filePath, "utf-8")
    .split("\n")
    .filter(line => line.trim() !== ""); // remove empty lines


// chat template
const chatTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful customer support agent"],
    new MessagesPlaceholder("chat_history"),  // ["placeholer", "{chat_history}"], -> another syntax 
    ["human", "{query}"],
]);


// create prompt
const prompt = await chatTemplate.invoke({
    chat_history: chatHistory,
    query: "Where is my refund?"
});


console.log(prompt.toChatMessages());