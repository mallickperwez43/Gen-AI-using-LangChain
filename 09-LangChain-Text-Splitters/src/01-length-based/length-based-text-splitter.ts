import { CharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("dl-curriculum.pdf");

const docs = await loader.load();

const splitter = new CharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 0,
    separator: "",
});

const result = await splitter.splitDocuments(docs);

console.log(result[1]?.pageContent);