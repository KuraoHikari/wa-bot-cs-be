import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import { OpenAI } from "openai";
const openai = new OpenAI({
 apiKey: process.env.OPEN_AI_API_KEY, // This is also the default, can be omitted
});

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getContext } from "./context.js";

const client = new Client({
 puppeteer: {
  headless: true,
  args: [
   "--no-sandbox",
   "--disable-setuid-sandbox",
   "--disable-dev-shm-usage",
   "--disable-accelerated-2d-canvas",
   "--no-first-run",
   "--no-zygote",
   "--disable-gpu",
  ],
 },
});
client.on("qr", (qr) => {
 if (client.info && client.info.wid) {
  console.log(
   "Client is connected and has the following WhatsApp ID:",
   client.info.wid._serialized
  );
 } else {
  console.log("Client is not connected.");
 }
 // Log QR code, you can send it to the frontend via WebSocket or REST API
 //  console.log("QR RECEIVED", qr);
 //  qrcode
 //   .toString(qr, { type: "terminal" })
 //   .then((url) => console.log(url))
 //   .catch((err) => console.error(err));
});

client.on("authenticated", () => {
 console.log("Client is authenticated!");
});

// Fired when the client is ready (authenticated and connected)
client.on("ready", () => {
 console.log("WhatsApp is ready and connected!");
});

// Fired when the client gets disconnected
client.on("disconnected", (reason) => {
 console.log("WhatsApp was disconnected:", reason);
});

client.on("message", async (message) => {
 //  console.log("🚀 ~ client.on ~ message:", message);
 if (client.info && client.info.wid) {
  console.log(
   "Client is connected and has the following WhatsApp ID:",
   client.info.wid._serialized
  );
 } else {
  console.log("Client is not connected.");
 }

 if (message.body && client.info && client.info.wid) {
  try {
   //finduser
   const userAuth = await prisma.user.findFirst({
    where: {
     phoneNumber: client.info.wid._serialized.split("@c.us")[0],
    },
    select: {
     id: true,
     email: true,
     phoneNumber: true,
     setting: true,
    },
   });
   console.log("🚀 ~ client.on ~ userAuth:", userAuth);

   const [upsertContact, createMessage] = await Promise.all([
    prisma.contact.upsert({
     where: {
      number_userId: {
       number: message.from,
       userId: userAuth.id,
      },
     },
     update: {},
     create: {
      userId: userAuth.id,
      notifyName: message._data.notifyName || message.from,
      number: message.from,
     },
    }),

    prisma.message.create({
     data: {
      userId: userAuth.id,
      content: message.body,
      aiMessage: false,
      from: message.from,
      to: message.to,
     },
    }),
   ]);

   console.log("🚀 ~ client.on ~ createMessage:", createMessage);
   console.log("🚀 ~ client.on ~ upsertContact:", upsertContact);

   if (userAuth.setting.stopAiResponse === false) {
    const upsertContactLimit = await prisma.contactLimit.upsert({
     where: {
      contactId_userId: {
       userId: userAuth.id,
       contactId: upsertContact.id,
      },
     },
     update: {},
     create: {
      userId: userAuth.id,
      contactId: upsertContact.id,
     },
    });

    if (upsertContactLimit.stopAiResponse === false) {
     if (
      upsertContactLimit.limitAiResponse === true &&
      upsertContactLimit.limitationCount > 0
     ) {
      await prisma.contactLimit.update({
       where: {
        contactId_userId: {
         userId: userAuth.id,
         contactId: upsertContact.id,
        },
       },
       data: {
        limitationCount: upsertContactLimit.limitationCount - 1,
       },
      });
     }
     if (
      upsertContactLimit.limitAiResponse === true &&
      upsertContactLimit.limitationCount <= 1
     ) {
      await prisma.contactLimit.update({
       where: {
        contactId_userId: {
         userId: userAuth.id,
         contactId: upsertContact.id,
        },
       },
       data: {
        limitationCount: 0,
        stopAiResponse: true,
       },
      });
     }

     const context = await getContext(message.body, userAuth.setting.pdf);
     const promtFromDb = {
      role: "system",
      content: userAuth.setting.prompt.replace("{{context}}", context),
     };

     const response = await openai.chat.completions.create({
      model: userAuth.setting.gptModel,
      messages: [
       promtFromDb,
       {
        role: "user",
        content: message.body,
       },
      ],
     });
     // console.log(
     //  "🚀 ~ client.on ~ response2:",
     //  response.choices[0].message.content
     // );

     await prisma.message.create({
      data: {
       userId: userAuth.id,
       content: response.choices[0].message.content,
       aiMessage: true,
       from: message.to,
       to: message.from,
      },
     }),
      //   console.log("🚀 ~ client.on ~ response:", response);
      //   console.log("🚀 ~ client.on ~ response:", response.choices[0].message);
      message.reply(response.choices[0].message.content);
    }
   }
  } catch (error) {
   console.log("🚀 ~ client.on ~ error:", error);
  }
 }
});

client.initialize();

export default client;
