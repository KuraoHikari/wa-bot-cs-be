import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginAuth(req, res) {
 try {
  const { email, password } = req.body;

  const findUser = await prisma.user.findUnique({
   where: { email: email },
  });

  if (!findUser) {
   return res
    .status(StatusCodes.FORBIDDEN)
    .json({ message: "Invalid Credentials" });
  }

  const match = await bcrypt.compare(password, findUser.password);

  if (match) {
   //login
   var token = jwt.sign(
    { id: findUser.id, email: findUser.email },
    process.env.JWT_SECRET
   );

   return res.status(StatusCodes.OK).json({ token: token });
  } else {
   return res
    .status(StatusCodes.FORBIDDEN)
    .json({ message: "Invalid Credentials" });
  }
 } catch (error) {
  console.log("🚀 ~ file: authController.js:41 ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function registerAuth(req, res) {
 try {
  const { email, password, phoneNumber } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
   data: { email: email, password: hashPassword, phoneNumber },
  });

  if (user) {
   await prisma.setting.create({
    data: { userId: user.id },
   });
  }

  return res.status(StatusCodes.CREATED).send({ message: "User Created" });
 } catch (error) {
  console.log("🚀 ~ registerAuth ~ error:", error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
   if (error.code === "P2002") {
    return res
     .status(StatusCodes.FORBIDDEN)
     .json({ message: "User Already Exit" });
   }
  }
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
