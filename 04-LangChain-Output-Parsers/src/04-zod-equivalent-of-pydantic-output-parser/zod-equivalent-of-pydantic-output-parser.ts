import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { z } from "zod";

const HF_KEY = process.env.HUGGINGFACEHUB_ACCESS_TOKEN;

if (!HF_KEY) {
    throw new Error("No Hugging Face API key found");
}

// console.log(
//     "HF key exists:",
//     Boolean(process.env.HUGGINGFACEHUB_ACCESS_TOKEN)
// );

// console.log(
//     "HF key starts with hf_:",
//     process.env.HUGGINGFACEHUB_ACCESS_TOKEN?.startsWith("hf_")
// );

const hf = new InferenceClient(HF_KEY);

const PersonSchema = z.object({
    name: z.string().describe("Name of the person"),
    age: z.number().int().gt(18).describe("Age of the person"),
    city: z.string().describe("Name of the city the person belongs to")
});

const formatInstruction = `
Return ONLY a valid JSON object.

The JSON must have exactly these fields:

{
    "name": "example name",
    "age": 25,
    "city": "example city"
}

Replace the example values with actual values.

Rules:
- "name" must be a string.
- "age" must be an integer greater than 18.
- "city" must be a string.
- Do NOT write anything before or after the JSON.
- Do NOT use markdown.
`;

const template = new PromptTemplate({
    template: `
        Generate the name, age and city of a fictional {place} person.

        {format_instruction}
    `,
    inputVariables: ["place"],
    partialVariables: {
        format_instruction: formatInstruction,
    },
});

const model = new RunnableLambda({
    func: async (promptValue: unknown) => {

        const prompt = String(promptValue);

        const response = await hf.chatCompletion({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 256,
        });

        const output = response.choices[0]?.message.content;

        if (!output) {
            throw new Error("No response received from Hugging Face");
        }

        return output;
    },
});

const parser = new RunnableLambda({
    func: async (output: unknown) => {

        const text = String(output)
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("No JSON object found in model output");
        }

        const jsonText = text.slice(start, end + 1);

        // console.log("\n--- JSON TO PARSE ---");
        // console.log(jsonText);
        // console.log("---------------------\n");

        const json = JSON.parse(jsonText);

        return PersonSchema.parse(json);
    },
});

const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({
    place: "Sri Lankan",
});

console.log(result);