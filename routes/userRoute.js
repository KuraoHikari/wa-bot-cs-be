import { Router } from "express";

import { validateData } from "../middleware/validationMiddleware.js";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import { updateUserSchema } from "../validation/userValidation.js";
import { getUser, updateUser } from "../controllers/userController.js";

const userRoute = Router();

userRoute.use(authenticationMiddleware);

userRoute.get("/", getUser);
userRoute.put("/", validateData(updateUserSchema), updateUser);

export default userRoute;
