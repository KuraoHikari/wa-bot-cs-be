import { Router } from "express";

import { validateData } from "../middleware/validationMiddleware.js";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import { getSetting, updateSetting } from "../controllers/settingController.js";
import { settingSchema } from "../validation/settingValidation.js";

const settingRoute = Router();

settingRoute.use(authenticationMiddleware);

settingRoute.get("/", getSetting);
settingRoute.put("/", validateData(settingSchema), updateSetting);

export default settingRoute;
