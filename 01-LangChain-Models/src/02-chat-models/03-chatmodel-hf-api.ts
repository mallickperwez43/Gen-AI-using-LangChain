import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";

const HF_KEY = process.env.HUGGINGFACEHUB_ACCESS_TOKEN;

if (!HF_KEY) {
    throw new Error("No API key found");
}

const client = new InferenceClient(HF_KEY);

console.log("Calling Hugging Face...");

try {
    const result = await client.chatCompletion({
        model: "openai/gpt-oss-120b:fastest",
        messages: [
            {
                role: "user",
                content: "What is the capital of India?",
            },
        ],
        max_tokens: 100,
    });

    console.log(result.choices[0]?.message.content);
} catch (error) {
    console.error("ERROR:");
    console.error(error);
}