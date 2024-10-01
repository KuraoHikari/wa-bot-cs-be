import "dotenv/config";

import { StatusCodes } from "http-status-codes";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getContacts(req, res) {
 try {
  const { page = "1", limit = "5" } = req.query;

  const { number } = req.body;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const { id: userId } = req.user;

  const whereConditions = {
   userId: userId,
   AND: [],
  };

  if (number) {
   whereConditions.AND.push({
    number: {
     contains: number,
     mode: "insensitive",
    },
   });
  }

  const [contacts, totalContacts] = await Promise.all([
   prisma.contact.findMany({
    where: whereConditions,
    skip: skip,
    take: limitNum,
    include: {
     contactLimits: true,
    },
    orderBy: { createdAt: "desc" },
   }),
   prisma.contact.count({
    where: whereConditions,
   }),
  ]);

  return res.status(StatusCodes.OK).json({
   data: contacts,
   total: totalContacts,
   page: pageNum,
   totalPages: Math.ceil(totalContacts / limitNum),
  });
 } catch (error) {
  console.log("🚀 ~ getContacts ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function getContact(req, res) {
 try {
  const { number } = req.params;
  const { id: userId } = req.user;
  const contact = await prisma.contact.findUnique({
   where: {
    number_userId: {
     userId,
     number,
    },
   },
  });

  if (!contact) {
   return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: "Contact not Found" });
  }

  return res.status(StatusCodes.OK).send(contact);
 } catch (error) {
  console.log("🚀 ~ getContact ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function getContactLimit(req, res) {
 try {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const contact = await prisma.contactLimit.findUnique({
   where: {
    contactId_userId: {
     contactId: +contactId,
     userId,
    },
   },
  });

  if (!contact) {
   return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: "Contact not Found" });
  }

  return res.status(StatusCodes.OK).send(contact);
 } catch (error) {
  console.log("🚀 ~ getContact ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function updateContact(req, res) {
 try {
  const { number } = req.params;
  const { id: userId } = req.user;
  const { notifyName, nameByUser, note } = req.body;

  const whereConditions = {
   number_userId: {
    userId,
    number,
   },
  };

  const contact = await prisma.contact.findUnique({
   where: whereConditions,
  });

  if (!contact) {
   return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: "Contact not Found" });
  }

  let updateData = {};

  if (notifyName) {
   updateData.notifyName = notifyName;
  }
  if (nameByUser) {
   updateData.nameByUser = nameByUser;
  }
  if (note) {
   updateData.note = note;
  }

  const updateContact = await prisma.contact.update({
   where: whereConditions,
   data: updateData,
  });

  return res.status(StatusCodes.OK).send(updateContact);
 } catch (error) {
  console.log("🚀 ~ getContact ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}

export async function updateContactLimit(req, res) {
 try {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const { limitAiResponse, limitationCount, stopAiResponse } = req.body;

  const whereConditions = {
   contactId_userId: {
    contactId: +contactId,
    userId,
   },
  };

  const contact = await prisma.contactLimit.findUnique({
   where: whereConditions,
  });

  if (!contact) {
   return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: "Contact not Found" });
  }

  let updateData = {};

  if (typeof limitAiResponse === "boolean") {
   updateData.limitAiResponse = limitAiResponse;
  }
  if (typeof limitationCount === "number") {
   updateData.limitationCount = limitationCount;
  }
  if (typeof stopAiResponse === "boolean") {
   updateData.stopAiResponse = stopAiResponse;
  }

  console.log("🚀 ~ updateContactLimit ~ updateData:", updateData);

  const updateContact = await prisma.contactLimit.update({
   where: whereConditions,
   data: updateData,
  });

  return res.status(StatusCodes.OK).send(updateContact);
 } catch (error) {
  console.log("🚀 ~ getContact ~ error:", error);
  return res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .json({ error: "Internal Server Error" });
 }
}
