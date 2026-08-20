import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const HF_KEY = process.env.HUGGINGFACEHUB_ACCESS_TOKEN;

if (!HF_KEY) {
    throw new Error("No API key found");
}

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: HF_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2"
});

const documents = [
    "The Great Barrier Reef is the largest coral reef system on Earth and can be seen from space.",
    "Quantum computing relies on qubits to perform complex calculations far faster than standard computers.",
    "NASA launched the James Webb Space Telescope to capture high-definition infrared images of deep space.",
    "Sourdough bread relies on a wild fermentation process using naturally occurring yeast and bacteria.",
    "The ancient city of Pompeii was preserved under volcanic ash after Mount Vesuvius erupted in 79 AD."
];

const result = await embeddings.embedDocuments(documents);

// console.log(result);
console.log("Vector Dimensions:", result.length);
console.log("Sample Vector Slice:", result.slice(0, 5)); 