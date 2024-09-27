import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser(req, res) {
 try {
  const { id: userId } = req.user;
  const setting = await prisma.user.findUnique({
   where: {
    id: userId,
   },
   select: {
    email: true,
    phoneNumber: true,
   },
  });

  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function updateUser(req, res) {
 try {
  const { id: userId } = req.user;
  const { phoneNumber } = req.body;
  const setting = await prisma.user.update({
   where: {
    id: userId,
   },
   data: {
    phoneNumber: phoneNumber,
   },
  });
  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
