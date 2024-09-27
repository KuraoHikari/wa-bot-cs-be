import { Pinecone } from "@pinecone-database/pinecone";

import { convertToAscii } from "./pinecone.js";
import { getEmbeddings } from "./embeding.js";

export async function getMatchesFromEmbeddings(embeddings, fileKey) {
 try {
  const client = new Pinecone({
   apiKey: process.env.PINECONE_API_KEY,
  });
  const pineconeIndex = await client.index("chatpdf");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  const queryResult = await namespace.query({
   topK: 5,
   vector: embeddings,
   includeMetadata: true,
  });
  return queryResult.matches || [];
 } catch (error) {
  console.log("error querying embeddings", error);
  throw error;
 }
}

export async function getContext(query, fileKey) {
 const queryEmbeddings = await getEmbeddings(query);
 const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

 const qualifyingDocs = matches.filter(
  (match) => match.score && match.score > 0.7
 );

 let docs = qualifyingDocs.map((match) => match.metadata.text);

 return docs.join("\n").substring(0, 3000);
}
