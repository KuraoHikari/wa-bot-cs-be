import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSetting(req, res) {
 try {
  const { id: userId } = req.user;
  const setting = await prisma.setting.findUnique({
   where: {
    userId,
   },
  });

  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function updateSetting(req, res) {
 try {
  const { id: userId } = req.user;
  const { stopAiResponse } = req.body;
  const setting = await prisma.setting.update({
   where: {
    userId,
   },
   data: {
    stopAiResponse: stopAiResponse,
   },
  });
  return res.status(StatusCodes.OK).send(setting);
 } catch (error) {
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
