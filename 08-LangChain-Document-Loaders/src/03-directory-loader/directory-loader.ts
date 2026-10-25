import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new DirectoryLoader("books", {
    ".pdf": (path) => new PDFLoader(path),
});

const docs = await loader.load();

for (const document of docs) {
    console.log(document.metadata);
}    