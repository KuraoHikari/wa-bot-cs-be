import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware.js";
import {
 getContact,
 getContactLimit,
 getContacts,
 updateContact,
 updateContactLimit,
} from "../controllers/contactController.js";
import {
 getContactLimitSchema,
 getContactsQuerySchema,
 updateContactDetailSchema,
 updateContactLimitSchema,
} from "../validation/contactValidation.js";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";

const contactRoute = Router();

contactRoute.use(authenticationMiddleware);

contactRoute.get("/", validateData(getContactsQuerySchema), getContacts);
contactRoute.get("/:number", getContact);
contactRoute.put(
 "/:number",
 validateData(updateContactDetailSchema),
 updateContact
);

contactRoute.get(
 "/:contactId/limit",
 validateData(getContactLimitSchema),
 getContactLimit
);

contactRoute.put(
 "/:contactId/limit",
 validateData(updateContactLimitSchema),
 updateContactLimit
);
export default contactRoute;
