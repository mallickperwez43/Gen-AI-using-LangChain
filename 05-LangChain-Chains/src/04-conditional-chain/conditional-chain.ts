import "dotenv/config";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";
import { z } from "zod";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const model = new ChatGoogle({
    model: "gemini-3.1-flash-lite",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});

// parsers
const parser = new StringOutputParser();

const feedbackSchema = z.object({
    "sentiment": z.enum(["positive", "negative"]).describe("Give the sentiment of the feedback")
});

type Feedback = z.infer<typeof feedbackSchema>;

type ClassifiedFeedback = {
    feedback: string;
    sentiment: Feedback["sentiment"];
};

// classifier prompt
const template1 = new PromptTemplate({
    template: ` Classify the sentiment of the following feedback text into positive or negative. 
    Return ONLY valid JSON in this format: 
    {{ 
        "sentiment": "positive" 
    }}
    Feedback: {feedback} 
    `,
    inputVariables: ["feedback"],
});

// classifier Parser 
const feedbackParser = new RunnableLambda({
    func: async (output: unknown): Promise<Feedback> => {
        const text = String(output).trim();

        const cleanedText = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

        const json = JSON.parse(cleanedText);

        return feedbackSchema.parse(json);
    },
});

// classifier Chain
const classifierChain = new RunnableLambda<{ feedback: string }, ClassifiedFeedback>({
    func: async (input: { feedback: string }) => {
        const sentiment = await template1.pipe(model).pipe(parser).pipe(feedbackParser).invoke(input);

        return {
            feedback: input.feedback,
            sentiment: sentiment.sentiment
        }
    }
})

// Positive response template
const template2 = new PromptTemplate({
    template: ` 
    Write an appropriate response to this positive feedback:
    
    {feedback}
    `,
    inputVariables: ["feedback"],
});

// Negative response template
const template3 = new PromptTemplate({
    template: ` 
    Write an appropriate response to this negative feedback:
    
    {feedback}
    `,
    inputVariables: ["feedback"],
});

// Conditional Branch

const positiveCondition = new RunnableLambda<ClassifiedFeedback, boolean>({
    func: async (input: ClassifiedFeedback) => input.sentiment === "positive",
});

const negativeCondition = new RunnableLambda<ClassifiedFeedback, boolean>({
    func: async (input: ClassifiedFeedback) => input.sentiment === "negative",
});

const branchChain = new RunnableBranch({
    branches: [
        [
            positiveCondition,
            template2.pipe(model).pipe(parser),
        ],

        [
            negativeCondition,
            template3.pipe(model).pipe(parser),
        ],
    ],

    default: new RunnableLambda({
        func: async () => "Could not find sentiment",
    }),
});


// Complete Chain

const chain = classifierChain.pipe(branchChain);

// result

const resultOne = await chain.invoke({
    feedback: "This is a beautiful phone!"
});

const resultTwo = await chain.invoke({
    feedback: "This is a terrible phone!"
});

console.log(resultOne);
console.log("-------------------------------------------------------------------xxxxxxxxxxx---------------------------------------------------");
console.log(resultTwo);
console.log("-------------------------------------------------------------------xxxxxxxxxxx---------------------------------------------------");
console.log(chain.getGraph().drawMermaid());