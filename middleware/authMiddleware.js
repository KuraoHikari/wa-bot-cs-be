import jwt from "jsonwebtoken";
import "dotenv/config";
import { StatusCodes } from "http-status-codes";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authenticationMiddleware(req, res, next) {
 try {
  const token = req.headers.token;
  // console.log("🚀 ~ authenticationMiddleware ~ token:", token);

  if (!token) {
   throw new Error("Unauthicated");
  }

  const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!verifyToken) {
   throw new Error("Unauthicated");
  } else {
   const { id } = verifyToken;

   const findUser = await prisma.user.findUnique({
    where: { id: id },
   });

   if (!findUser) {
    throw new Error("Unauthicated");
   }

   req.user = verifyToken;

   next();
  }
 } catch (error) {
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthicated" });
 }
}
