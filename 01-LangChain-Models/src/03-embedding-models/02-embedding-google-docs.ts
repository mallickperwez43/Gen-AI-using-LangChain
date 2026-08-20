import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No API key found");
}

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: GOOGLE_KEY,
    model: "gemini-embedding-001"
});

embeddings.maxBatchSize = 2; // batch - size for documents where we have 100 documents
// batch size  = 10 => 10 batches => [1..10] [11.. 20] ....... [91...100]

const documents = [
    "TypeScript provides static type checking to catch JavaScript bugs early during development.",
    "The Eiffel Tower, completed in 1889, is located in Paris and stands at over 300 meters tall.",
    "Photosynthesis is the chemical process where green plants convert sunlight into usable energy.",
    "Relational databases organize structured data into strict tables using rows and columns.",
    "A hot cup of espresso requires finely ground coffee beans forced under high pressure water."
];

const result = await embeddings.embedDocuments(documents);

console.log(result);
console.log("Vector Dimensions:", result.length);
console.log("Sample Vector Slice:", result.slice(0, 5));