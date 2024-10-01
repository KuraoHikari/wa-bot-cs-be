import { Router } from "express";

import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import { getQrCode, logout } from "../controllers/whatsappController.js";

const whatsappRoute = Router();

whatsappRoute.use(authenticationMiddleware);

whatsappRoute.get("/qr-code", getQrCode);
whatsappRoute.post("/logout", logout);

export default whatsappRoute;
