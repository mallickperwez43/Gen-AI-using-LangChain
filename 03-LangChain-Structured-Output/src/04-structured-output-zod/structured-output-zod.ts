import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

const ReviewSchema = z.object({
    key_themes: z.array(z.string()).describe("Write down all the key themes discussed in the review in an array"),
    summary: z.string().describe("A brief summary of the review"),
    sentiment: z.enum(["pos", "neg"]).describe("Return sentiment of the review either negative, positive or neutral"),
    pros: z.array(z.string()).optional().describe("Write down all the pros inside a list"),
    cons: z.array(z.string()).optional().describe("Write down all the cons inside a list"),
    name: z.string().optional().describe("Write the name of the reviewer"),
});

type ReviewType = z.infer<typeof ReviewSchema>;

const structuredModel = model.withStructuredOutput(ReviewSchema);

const result = await structuredModel.invoke(`
I recently upgraded to the Samsung Galaxy S24 Ultra, and I must say,
it’s an absolute powerhouse! The Snapdragon 8 Gen 3 processor makes
everything lightning fast—whether I’m gaming, multitasking, or editing
photos. The 5000mAh battery easily lasts a full day even with heavy use,
and the 45W fast charging is a lifesaver.

The S-Pen integration is a great touch for note-taking and quick sketches,
though I don't use it often. What really blew me away is the 200MP camera—
the night mode is stunning, capturing crisp, vibrant images even in low
light. Zooming up to 100x actually works well for distant objects, but
anything beyond 30x loses quality.

However, the weight and size make it a bit uncomfortable for one-handed
use. Also, Samsung’s One UI still comes with bloatware—why do I need five
different Samsung apps for things Google already provides? The $1,300 price
tag is also a hard pill to swallow.

Pros:
Insanely powerful processor (great for gaming and productivity)
Stunning 200MP camera with incredible zoom capabilities
Long battery life with fast charging
S-Pen support is unique and useful

Review by Alex
`) as ReviewType;

console.log(result);
console.log("Reviewer's Name: ", result.name);
console.log("Reviewer's Sentiment: ", result.sentiment);
