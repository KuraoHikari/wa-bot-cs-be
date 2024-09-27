import { Router } from "express";
import authRoute from "./authRoute.js";
import settingRoute from "./settingRoute.js";
import userRoute from "./userRoute.js";
import contactRoute from "./contactRoute.js";
import messageRoute from "./messageRoute.js";
import whatsappRoute from "./whatsappRoute.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/setting", settingRoute);
router.use("/user", userRoute);
router.use("/contact", contactRoute);
router.use("/message", messageRoute);
router.use("/whatsapp", whatsappRoute);

export default router;
