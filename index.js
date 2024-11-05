import "dotenv/config";

import express from "express";
import client from "./utils/waWeb.js";
import qrcode from "qrcode";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import cors from "cors";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
