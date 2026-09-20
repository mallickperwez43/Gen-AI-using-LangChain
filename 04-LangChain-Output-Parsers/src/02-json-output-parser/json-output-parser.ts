import "dotenv/config";

import { InferenceClient } from "@huggingface/inference";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";


const HF_KEY = process.env.HUGGINGFACEHUB_ACCESS_TOKEN;

if (!HF_KEY) {
    throw new Error("No API key found");
}


const hf = new InferenceClient(HF_KEY);


const parser = new JsonOutputParser();


const template = new PromptTemplate({
    // Here we gaved the structure to the template for better result
    template: `
You must return ONLY valid JSON.

Do not write any introduction.
Do not write any explanation.
Do not use Markdown.
Do not write "Here are 5 facts".

Return exactly this structure:

{{
  "facts": [
    "fact 1",
    "fact 2",
    "fact 3",
    "fact 4",
    "fact 5"
  ]
}}

Topic: {topic}

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
    },
});


const chain = template
    .pipe(model)
    .pipe(parser);


const result = await chain.invoke({
    topic: "black hole",
});


console.log(result);