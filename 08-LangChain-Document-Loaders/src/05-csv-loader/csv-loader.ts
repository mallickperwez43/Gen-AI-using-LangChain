import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader("Social_Network_Ads.csv");

const docs = await loader.load();

console.log(docs.length);
console.log("-----------------------------------------------------------------------------------------");
console.log(docs[1]);