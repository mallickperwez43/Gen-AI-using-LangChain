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

const result = await embeddings.embedQuery("What is the capital of India?")

console.log(result);