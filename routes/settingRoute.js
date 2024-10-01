import { Router } from "express";

import { validateData } from "../middleware/validationMiddleware.js";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import {
 getPdf,
 getSetting,
 updateSetting,
 updateSettingGpt,
 updateSettingPdf,
} from "../controllers/settingController.js";
import {
 settingSchema,
 updatePromtSchema,
} from "../validation/settingValidation.js";
import multer from "multer";
import path from "path";

const settingRoute = Router();

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, "uploads/"); // Specify the destination folder
 },
 filename: (req, file, cb) => {
  cb(null, Date.now() + path.extname(file.originalname)); // Save with unique name
 },
});

const upload = multer({ storage });

settingRoute.use(authenticationMiddleware);

settingRoute.get("/", getSetting);
settingRoute.get("/pdf/:filename", getPdf);
settingRoute.put("/", validateData(settingSchema), updateSetting);
settingRoute.put("/gpt", validateData(updatePromtSchema), updateSettingGpt);
settingRoute.post("/upload-pdf", upload.single("pdf"), updateSettingPdf);

export default settingRoute;
