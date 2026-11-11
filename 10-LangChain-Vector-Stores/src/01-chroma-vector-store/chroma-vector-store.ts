import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { CloudClient } from "chromadb";

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

// 1. Create LangChain documents

const doc1 = new Document({
    pageContent:
        "Virat Kohli is one of the most successful and consistent batsmen in IPL history.Known for his aggressive batting style and fitness, he has led the Royal Challengers Bangalore in multiple seasons.",
    metadata: {
        team: "Royal Challengers Bangalore",
    },
});

const doc2 = new Document({
    pageContent:
        "Rohit Sharma is the most successful captain in IPL history, leading Mumbai Indians to five titles. He's known for his calm demeanor and ability to play big innings under pressure.",
    metadata: {
        team: "Mumbai Indians",
    },
});

const doc3 = new Document({
    pageContent:
        "MS Dhoni, famously known as Captain Cool, has led Chennai Super Kings to multiple IPL titles. His finishing skills, wicketkeeping, and leadership are legendary.",
    metadata: {
        team: "Chennai Super Kings",
    },
});

const doc4 = new Document({
    pageContent:
        "Jasprit Bumrah is considered one of the best fast bowlers in T20 cricket. Playing for Mumbai Indians, he is known for his yorkers and death-over expertise.",
    metadata: {
        team: "Mumbai Indians",
    },
});

const doc5 = new Document({
    pageContent:
        "Ravindra Jadeja is a dynamic all-rounder who contributes with both bat and ball. Representing Chennai Super Kings, his quick fielding and match-winning performances make him a key player.",
    metadata: {
        team: "Chennai Super Kings",
    },
});

// 2 Create documents array

const docs = [doc1, doc2, doc3, doc4, doc5];

// 3 Google embedding model

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: GOOGLE_KEY,
});

// 4 Chroma cloud client

const client = new CloudClient({
    apiKey: CHROMA_API_KEY,
    tenant: CHROMA_TENANT,
    database: CHROMA_DATABASE,
});

// 5 Create / get collection (vector store)

const collection = await client.getOrCreateCollection({
    name: "sample",
});

// 6 Create embeddings for documents

const documentTexts = docs.map(
    (document) => document.pageContent
);

const documentEmbeddings = await embeddings.embedDocuments(documentTexts);

// 7 Add documents to collection(vector store)

await collection.upsert({
    ids: ["doc1", "doc2", "doc3", "doc4", "doc5"],

    documents: documentTexts,

    embeddings: documentEmbeddings,

    metadatas: docs.map(
        (document) => document.metadata
    ),
});

// 8 Similarity Search

const query = "Who among these are a bowler?";

const queryEmbedding = await embeddings.embedQuery(query);

const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 2,
});

// 9 Print Result
console.log("\n---------------- SIMILARITY SEARCH ----------------");

console.log(results);

// 10 Metadata Filtering

const filteredResults = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 10,
    where: {
        team: "Chennai Super Kings",
    }
});

console.log("\n---------------- METADATA FILTERING ----------------");
console.log(filteredResults);

// 11 Update Document

const updatedDoc1 = new Document({
    pageContent:
        "Virat Kohli, the former captain of Royal Challengers Bangalore (RCB), is renowned for his aggressive leadership and consistent batting performances. He holds the record for the most runs in IPL history, including multiple centuries in a single season. Despite RCB not winning an IPL title under his captaincy, Kohli's passion and fitness set a benchmark for the league. His ability to chase targets and anchor innings has made him one of the most dependable players in T20 cricket.",
    metadata: {
        team: "Royal Challengers Bangalore",
    },
});

const updatedEmbedding = await embeddings.embedQuery(updatedDoc1.pageContent);

await collection.update({
    ids: ["doc1"],
    documents: [updatedDoc1.pageContent],
    embeddings: [updatedEmbedding],
    metadatas: [updatedDoc1.metadata],
});

console.log("\n---------------- DOCUMENT UPDATED ----------------");
console.log("doc1 updated successfully");

// 12 View Documents 

const allDocuments = await collection.get({
    include: ["embeddings", "documents", "metadatas",],
});

console.log("\n---------------- ALL DOCUMENTS ----------------");
console.log(allDocuments);

// 13 Delete Document 

await collection.delete({
    ids: ["doc1"],
});

console.log("\n---------------- DOCUMENT DELETED ----------------");

console.log("doc1 deleted successfully");

// 14 View Documents Again 

const remainingDocuments = await collection.get({
    include: ["documents", "metadatas",],
});

console.log("\n---------------- AFTER DELETE ----------------");

console.log(remainingDocuments);