import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "date-fns";

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

export async function getUserStat(req, res) {
 try {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const { id: userId } = req.user;

  const user = await prisma.user.findUnique({
   where: {
    id: userId,
   },
   select: {
    email: true,
    phoneNumber: true,
   },
  });

  const [
   countAiMessagesThisMonth,
   countAiMessagesThisWeek,
   countMessagesFromUserThisWeek,
  ] = await Promise.all([
   prisma.message.count({
    where: {
     userId,
     aiMessage: true,
     createdAt: {
      gte: monthStart,
      lte: monthEnd,
     },
    },
   }),
   prisma.message.count({
    where: {
     userId,
     aiMessage: true,
     createdAt: {
      gte: weekStart,
      lte: weekEnd,
     },
    },
   }),
   prisma.message.count({
    where: {
     userId,
     from: {
      not: {
       equals: `${user.phoneNumber}@c.us`,
      },
     },
     createdAt: {
      gte: weekStart,
      lte: weekEnd,
     },
    },
   }),
  ]);
  return res.status(StatusCodes.OK).send({
   countAiMessagesThisMonth,
   countAiMessagesThisWeek,
   countMessagesFromUserThisWeek,
  });
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
