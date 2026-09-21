import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const HF_KEY = process.env.HUGGINGFACEHUB_ACCESS_TOKEN;

if (!HF_KEY) {
    throw new Error("No API key found");
}

const hf = new InferenceClient(HF_KEY);

const parser = StructuredOutputParser.fromNamesAndDescriptions({
    fact_1: "Fact 1 about the topic",
    fact_2: "Fact 2 about the topic",
    fact_3: "Fact 3 about the topic",
});

const template = new PromptTemplate({
    template: `
        Give 3 facts about {topic}.

        {format_instruction}
    `,
    inputVariables: ["topic"],
    partialVariables: {
        format_instruction: parser.getFormatInstructions(),
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

            max_tokens: 512,
        });

        const output = response.choices[0]?.message.content;

        if (!output) {
            throw new Error("No response received from Hugging Face");
        }

        return output;
    }
});

const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({
    topic: "black hole",
});

console.log(result);