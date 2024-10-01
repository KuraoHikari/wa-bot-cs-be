import "dotenv/config";

import express from "express";
import client from "./utils/waWeb.js";
import qrcode from "qrcode";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import multer from "multer";
import { loadPDFIntoPinecone } from "./utils/pinecone.js";

const app = express();
app.use(express.json());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.get("/", (req, res) => {
 res.send("WhatsApp Bot Backend is running");
});

// Route to get QR code for login
app.get("/get-qr", async (req, res) => {
 client.on("qr", (qr) => {
  qrcode
   .toDataURL(qr)
   .then((url) => res.send({ qr: url }))
   .catch((err) => res.status(500).send({ error: err.message }));
 });
});

// Configure multer for file uploads

// Route to handle PDF upload
// app.post("/upload", upload.single("pdf"), async (req, res) => {
//  try {
//   const filePath = req.file.path; // Get the path to the uploaded file
//   console.log("File uploaded successfully:", filePath);

//   // Call your function to process the PDF
//   await loadPDFIntoPinecone(filePath);

//   res.status(200).send("PDF successfully uploaded and processed.");
//  } catch (error) {
//   console.error("Error processing PDF:", error);
//   res.status(500).send("Error processing PDF.");
//  }
// });

// app.get("/get-qr-once", (req, res) => {
//  // Listen for the QR code event
//  client.once("qr", (qr) => {
//   // 'once' ensures it only fires once
//   qrcode
//    .toDataURL(qr)
//    .then((url) => {
//     res.send({ qr: url }); // Send the QR code to the client
//    })
//    .catch((err) => {
//     res.status(500).send({ error: err.message });
//    });
//  });
// });

// Example endpoint to send a message
// app.post("/send-message", (req, res) => {
//  const { number, message } = req.body;

//  const chatId = number.includes("@c.us") ? number : `${number}@c.us`;

//  client
//   .sendMessage(chatId, message)
//   .then((response) => {
//    res.status(200).json({
//     status: "success",
//     message: "Message sent",
//     data: response,
//    });
//   })
//   .catch((err) => {
//    res.status(500).json({
//     status: "error",
//     message: "Failed to send message",
//     error: err.message,
//    });
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
