import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { Prisma, PrismaClient } from "@prisma/client";
import { loadPDFIntoPinecone } from "../utils/pinecone.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, ".."); // Adjust based on where your controllers are

const prisma = new PrismaClient();

export async function getSetting(req, res) {
 try {
  const { id: userId } = req.user;
  const setting = await prisma.setting.findUnique({
   where: {
    userId,
   },
  });

  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
export async function getPdf(req, res) {
 const { filename } = req.params;
 const filePath = path.join(rootDir, "uploads", filename);
 console.log("🚀 ~ getPdf ~ filePath:", filePath);

 // Check if the file exists
 fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
   console.error("PDF file not found:", err);
   return res.status(404).send("PDF not found");
  }

  // Set the correct content type for PDF
  res.setHeader("Content-Type", "application/pdf");

  // Send the file
  res.sendFile(filePath, (err) => {
   if (err) {
    console.error("Error sending file:", err);
    return res.status(500).send("Error sending the PDF");
   }
  });
 });
}

export async function updateSetting(req, res) {
 try {
  const { id: userId } = req.user;
  const { stopAiResponse } = req.body;
  const setting = await prisma.setting.update({
   where: {
    userId,
   },
   data: {
    stopAiResponse: stopAiResponse,
   },
  });
  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function updateSettingGpt(req, res) {
 try {
  const { id: userId } = req.user;
  const { prompt, gptModel } = req.body;

  let updateData = {};

  if (prompt) {
   updateData.prompt = prompt;
  }
  if (gptModel) {
   updateData.gptModel = gptModel;
  }
  const setting = await prisma.setting.update({
   where: {
    userId,
   },
   data: updateData,
  });
  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function updateSettingPdf(req, res) {
 try {
  const { id: userId } = req.user;

  const filePath = req.file.path; // Get the path to the uploaded file
  console.log("File uploaded successfully:", filePath);

  // Call your function to process the PDF
  await loadPDFIntoPinecone(filePath);

  // res.status(200).send("PDF successfully uploaded and processed.");

  const setting = await prisma.setting.update({
   where: {
    userId,
   },
   data: {
    pdf: filePath,
   },
  });
  return res.status(StatusCodes.OK).send({ setting });
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
