import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("dl-curriculum.pdf");

const docs = await loader.load();

console.log(docs.length);
console.log("---------------------------------------------------------------------------------------");
console.log(docs);
console.log("---------------------------------------------------------------------------------------");
console.log(docs[0]?.pageContent);
console.log("---------------------------------------------------------------------------------------");
console.log(docs[1]?.metadata);