import { Router } from "express";

import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import { getQrCode } from "../controllers/whatsappController.js";

const whatsappRoute = Router();

whatsappRoute.use(authenticationMiddleware);

whatsappRoute.get("/qr-code", getQrCode);

export default whatsappRoute;
