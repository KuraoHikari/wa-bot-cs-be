import { Router } from "express";

import { validateData } from "../middleware/validationMiddleware.js";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import { getMessages } from "../controllers/messageController.js";
import { getMessagesQuerySchema } from "../validation/messageValidation.js";

const messageRoute = Router();

messageRoute.use(authenticationMiddleware);

messageRoute.get("/", validateData(getMessagesQuerySchema), getMessages);

export default messageRoute;
