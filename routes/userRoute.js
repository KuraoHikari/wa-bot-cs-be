import { Router } from "express";

import { validateData } from "../middleware/validationMiddleware.js";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";
import { updateUserSchema } from "../validation/userValidation.js";
import {
 getUser,
 getUserStat,
 updateUser,
} from "../controllers/userController.js";

const userRoute = Router();

userRoute.use(authenticationMiddleware);

userRoute.get("/", getUser);
userRoute.get("/stat", getUserStat);
userRoute.put("/", validateData(updateUserSchema), updateUser);

export default userRoute;
