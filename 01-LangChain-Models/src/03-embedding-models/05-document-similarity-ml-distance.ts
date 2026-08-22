import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { similarity } from "ml-distance";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No API key found");
}

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: GOOGLE_KEY,
    model: "gemini-embedding-001",
});

const documents = [
    "Virat Kohli is an Indian cricketer known for his aggressive batting and leadership.",
    "MS Dhoni is a former Indian captain famous for his calm demeanor and finishing skills.",
    "Sachin Tendulkar, also known as the 'God of Cricket', holds many batting records.",
    "Rohit Sharma is known for his elegant batting and record-breaking double centuries.",
    "Jasprit Bumrah is an Indian fast bowler known for his unorthodox action and yorkers.",
];

const query1 = "Tell me about Virat Kohli";
const query2 = "Tell me about Jasprit Bumrah";

const docEmbeddings = await embeddings.embedDocuments(documents);
const query1Embedding = await embeddings.embedQuery(query1);
const query2Embedding = await embeddings.embedQuery(query2);

const scores1 = docEmbeddings.map((docEmbedding) => (
    similarity.cosine(query1Embedding, docEmbedding)
));

const scores2 = docEmbeddings.map((docEmbedding) => (
    similarity.cosine(query2Embedding, docEmbedding)
));

const index1 = scores1.indexOf(Math.max(...scores1));
const score1 = scores1[index1];

console.log("Result for Query 1")
console.log(query1);
console.log(documents[index1]);
console.log("Similarity score is:", score1);

console.log("----------------------------------------------------------");

const index2 = scores2.indexOf(Math.max(...scores2));
const score2 = scores2[index2];

console.log("Result for Query 2")
console.log(query2);
console.log(documents[index2]);
console.log("Similarity score is:", score2);