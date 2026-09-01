import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helful {domain} expert"],
    ["human", "Explain in simple terms, what is {topic}"]
]);

const prompt = await chatTemplate.invoke({
    domain: "cricket",
    topic: "long-off"
});

console.log(prompt);