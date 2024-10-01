import "dotenv/config";
import qrcode from "qrcode";
import { StatusCodes } from "http-status-codes";
import client from "../utils/waWeb.js";

export async function getQrCode(req, res) {
 try {
  if (!client.info) {
   client.once("qr", (qr) => {
    // Menggunakan 'once' untuk memastikan QR hanya diterima sekali
    qrcode
     .toDataURL(qr)
     .then((url) => res.send({ qr: url }))
     .catch((err) =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.message })
     );
   });
  } else {
   res
    .status(StatusCodes.BAD_REQUEST)
    .send({ error: "client already connected" });
  }
 } catch (error) {
  console.log("🚀 ~ getQrCode ~ error:", error);
  if (!res.headersSent) {
   // Memastikan respons belum dikirim
   res
    .status(StatusCodes.BAD_REQUEST)
    .send({ error: "client already connected" });
  }
 }
}

export async function logout(req, res) {
 try {
  await client.logout();
  res.status(StatusCodes.OK).json({
   status: "success",
   message: "Berhasil logout dari WhatsApp",
  });
 } catch (error) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
   status: "error",
   message: "Gagal logout dari WhatsApp",
   error: error.message,
  });
 }
}

export async function checkConnection(req, res) {
 if (client.info && client.info.wid) {
  client.on("qr", (qr) => {
   qrcode
    .toDataURL(qr)
    .then((url) => res.send({ qr: url }))
    .catch((err) =>
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.message })
    );
  });
 } else {
  res
   .status(StatusCodes.BAD_REQUEST)
   .send({ error: "client already connected" });
 }
}
