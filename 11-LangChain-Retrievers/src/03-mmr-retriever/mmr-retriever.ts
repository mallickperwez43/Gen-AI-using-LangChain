import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

// API Keys

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

// 1 Sample Document

const documents = [
    new Document({
        pageContent: "LangChain makes it easy to work with LLMs.",
    }),

    new Document({
        pageContent: "LangChain is used to build LLM based applications.",
    }),

    new Document({
        pageContent: "Chroma is used to store and search document embeddings.",
    }),

    new Document({
        pageContent: "Embeddings are vector representations of text.",
    }),

    new Document({
        pageContent: "MMR helps you get diverse results when doing similarity search.",
    }),

    new Document({
        pageContent: "LangChain supports Chroma, FAISS, Pinecone, and more.",
    }),
];

// 2 Embedding Model

const embeddingModel = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: GOOGLE_KEY,
});

// 3 Create Memory Vector Store

const vectorstore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddingModel,
);

// 4 Create MMR Retriever

const retriever = vectorstore.asRetriever({
    searchType: "mmr",

    k: 3,

    searchKwargs: {
        fetchK: 6,
        lambda: 0.5
    },
});

// 5 Query

const query = "What is LangChain?";

// 6 Retrieve documents using MMR

const results = await retriever.invoke(query);

// 7 Print Results

console.log("\n---------------- MMR RESULTS ----------------");

for (let i = 0; i < results.length; i++) {
    console.log(`\n--- Result ${i + 1} ---`);
    console.log(results[i]?.pageContent);
}