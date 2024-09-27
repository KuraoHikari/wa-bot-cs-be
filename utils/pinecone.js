import { promises as fs } from "fs"; // Make sure fs is imported
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
 Document,
 RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeding.js";
import md5 from "md5";

export const getPineconeClient = () => {
 return new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
 });
};

export async function loadPDFIntoPinecone(filePath) {
 // 1. Read the pdf file from the file system
 console.log("Reading PDF from file system: " + filePath);

 try {
  // Check if the file exists
  await fs.access(filePath);
  console.log("File exists, loading PDF...");
 } catch (err) {
  throw new Error("PDF file does not exist");
 }

 // If you want to load the PDF, uncomment this section when ready
 const loader = new PDFLoader(filePath);
 //  console.log("🚀 ~ loadPDFIntoPinecone ~ loader:", loader);
 const pages = await loader.load();
 //  console.log("🚀 ~ loadPDFIntoPinecone ~ pages:", pages);

 const documents = await Promise.all(pages.map(prepareDocument));
 //  console.log("🚀 ~ loadPDFIntoPinecone ~ documents:", documents);

 const vectors = await Promise.all(documents.flat().map(embedDocument));
 //  console.log("🚀 ~ loadPDFIntoPinecone ~ vectors:", vectors);

 const client = await getPineconeClient();
 const pineconeIndex = await client.index("chatpdf");
 const namespace = pineconeIndex.namespace(convertToAscii(filePath));

 await namespace.upsert(vectors);
}

async function prepareDocument(page) {
 let { pageContent, metadata } = page;
 pageContent = pageContent.replace(/\n/g, "");
 // split the docs
 const splitter = new RecursiveCharacterTextSplitter();
 const docs = await splitter.splitDocuments([
  new Document({
   pageContent,
   metadata: {
    pageNumber: metadata.loc.pageNumber,
    text: truncateStringByBytes(pageContent, 36000),
   },
  }),
 ]);
 return docs;
}

async function embedDocument(doc) {
 try {
  const embeddings = await getEmbeddings(doc.pageContent);
  const hash = md5(doc.pageContent);

  return {
   id: hash,
   values: embeddings,
   metadata: {
    text: doc.metadata.text,
    pageNumber: doc.metadata.pageNumber,
   },
  };
 } catch (error) {
  console.log("error embedding document", error);
  throw error;
 }
}

export const truncateStringByBytes = (str, bytes) => {
 const enc = new TextEncoder();
 return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

export function convertToAscii(inputString) {
 // remove non ascii characters
 const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
 return asciiString;
}

// (async () => {
//  await loadPDFIntoPinecone("./070323_CP_Wahana_Adya.pdf"); // Adjust the file path as needed
// })();
