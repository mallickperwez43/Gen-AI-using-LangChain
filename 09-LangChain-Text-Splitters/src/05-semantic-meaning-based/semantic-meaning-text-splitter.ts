import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SemanticChunker } from "@chonkiejs/core";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No API key found");
}

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: GOOGLE_KEY,
});

const sample = `
Farmers were working hard in the fields, preparing the soil and planting seeds for the next season. The sun was bright, and the air smelled of earth and fresh grass. The Indian Premier League (IPL) is the biggest cricket league in the world. People all over the world watch the matches and cheer for their favourite teams. 

Terrorism is a big danger to peace and safety. It causes harm to people and creates fear in cities and villages. When such attacks happen, they leave behind pain and sadness. To fight terrorism, we need strong laws, alert security forces, and support from people who care about peace and safety. 
`;

const chunker = await SemanticChunker.create({
    embeddings: async (texts) => {
        return await googleEmbeddings.embedDocuments(texts);
    },
    threshold: 0.5,
    chunkSize: 200,
});

const chunks = await chunker.chunk(sample);

console.log(chunks.length);
console.log(chunks);