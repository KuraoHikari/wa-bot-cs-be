import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getMessages(req, res) {
 try {
  const { page = "1", limit = "10" } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const { id: userId } = req.user;

  const whereConditions = {
   userId: userId,
  };

  const [messages, totalMessages] = await Promise.all([
   prisma.message.findMany({
    where: whereConditions,
    skip: skip,
    take: limitNum,
    orderBy: { createdAt: "desc" },
   }),
   await prisma.message.count({
    where: whereConditions,
   }),
  ]);

  return res.status(StatusCodes.OK).json({
   data: messages,
   total: totalMessages,
   page: pageNum,
   totalPages: Math.ceil(totalMessages / limitNum),
  });
 } catch (error) {
  console.log("🚀 ~ getContacts ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
