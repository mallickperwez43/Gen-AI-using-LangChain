import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CloudClient } from "chromadb";

// API Keys

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
const CHROMA_API_KEY = process.env.CHROMA_API_KEY;
const CHROMA_TENANT = process.env.CHROMA_TENANT;
const CHROMA_DATABASE = process.env.CHROMA_DATABASE;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

if (!CHROMA_API_KEY) {
    throw new Error("No CHROMA API key found");
}

if (!CHROMA_TENANT) {
    throw new Error("No CHROMA tenant found");
}

if (!CHROMA_DATABASE) {
    throw new Error("No CHROMA database found");
}

// 1. Source Documents

const documents = [
    new Document({
        pageContent:
            "LangChain helps developers build LLM applications easily.",
        metadata: {
            source: "lesson",
        },
    }),

    new Document({
        pageContent:
            "Chroma is a vector database optimized for LLM-based search.",
        metadata: {
            source: "lesson",
        },
    }),

    new Document({
        pageContent:
            "Embeddings convert text into high-dimensional vectors.",
        metadata: {
            source: "lesson",
        },
    }),

    new Document({
        pageContent:
            "OpenAI provides powerful embedding models.",
        metadata: {
            source: "lesson",
        },
    }),
];

// 2. Initialize Embedding Model

const embeddingModel = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: GOOGLE_KEY,
});

// 3. Create Chroma Cloud Client

const client = new CloudClient({
    apiKey: CHROMA_API_KEY,
    tenant: CHROMA_TENANT,
    database: CHROMA_DATABASE,
});

// 4. Create Vector Store

const vectorstore = new Chroma(
    embeddingModel,
    {
        collectionName: "vector-store-retriever",
        index: client,
    },
);

// 5. Add Documents

await vectorstore.addDocuments(documents);

// 6. Convert Vector Store into Retriever

const retriever = vectorstore.asRetriever({
    k: 2,
});

// 7. Query

const query = "What is Chroma used for?";

// 8. Retrieve Documents

const results = await retriever.invoke(query);

for (let i = 0; i < results.length; i++) {
    console.log(`\n--- Result ${i + 1} ---`);
    console.log(results[i]?.pageContent);
}

// 9. Direct Similarity Search

const similarityResults = await vectorstore.similaritySearch(
    query,
    2,
);

for (let i = 0; i < similarityResults.length; i++) {
    console.log(`\n--- Result ${i + 1} ---`);
    console.log(similarityResults[i]?.pageContent);
}