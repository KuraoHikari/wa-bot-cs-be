import { Router } from "express";
import { loginAuth, registerAuth } from "../controllers/authController.js";
import { validateData } from "../middleware/validationMiddleware.js";
import {
 loginSchema,
 registrationSchema,
} from "../validation/authValidation.js";

const authRoute = Router();

authRoute.post("/register", validateData(registrationSchema), registerAuth);
authRoute.post("/login", validateData(loginSchema), loginAuth);

export default authRoute;
