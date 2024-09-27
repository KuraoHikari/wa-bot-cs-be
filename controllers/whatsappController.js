import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import client from "../utils/waWeb.js";

export async function getQrCode(req, res) {
 client.on("qr", (qr) => {
  qrcode
   .toDataURL(qr)
   .then((url) => res.send({ qr: url }))
   .catch((err) =>
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.message })
   );
 });
}
