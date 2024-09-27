import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import { OpenAI } from "openai";
const openai = new OpenAI({
 apiKey: process.env.OPEN_AI_API_KEY, // This is also the default, can be omitted
});

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import qrcode from "qrcode";
import { getContext } from "./context.js";

const client = new Client({
 authStrategy: new LocalAuth(),
 puppeteer: { headless: true },
});

client.on("qr", (qr) => {
 // Log QR code, you can send it to the frontend via WebSocket or REST API
 console.log("QR RECEIVED", qr);
 qrcode
  .toString(qr, { type: "terminal" })
  .then((url) => console.log(url))
  .catch((err) => console.error(err));
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

     const context = await getContext(
      message.body,
      "./070323_CP_Wahana_Adya.pdf"
     );

     const prompt = {
      role: "system",
      content: `AI assistant is a professional and polite customer service work at PT. Wahana Adya representative.
           The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
           AI assistant provides clear, concise, and friendly responses without repeating unnecessary information or phrases such as "Berdasarkan informasi yang diberikan sebelumnya.", "dalam konteks yang diberikan.", "dalam konteks yang tersedia."
           AI is a well-behaved and well-mannered individual.
           AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
           AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
           AI assistant make answer using Indonesian Language.
           AI assistant avoids sounding repetitive and ensures responses sound natural and tailored to each question.
           If the context does not provide the answer to question, the AI assistant will say, "Mohon Maaf, tapi saya tidak dapat menjawab pertanyaan tersebut saat ini.".
           START CONTEXT BLOCK
      ${context}
           END OF CONTEXT BLOCK
           AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
           If the context does not provide the answer to question, the AI assistant will say, "Mohon Maaf, tapi saya tidak dapat menjawab pertanyaan tersebut saat ini.".
           AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
           AI assistant will not invent anything that is not drawn directly from the context.
           `,
     };

     const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
       prompt,
       {
        role: "user",
        content: message.body,
       },
      ],
     });

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

   //checkForAiResponse

   //upsertcontact

   //    const context = await getContext(
   //     message.body,
   //     "./070323_CP_Wahana_Adya.pdf"
   //    );

   //    const prompt = {
   //     role: "system",
   //     content: `AI assistant is a professional and polite customer service work at PT. Wahana Adya representative.
   //       The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
   //       AI assistant provides clear, concise, and friendly responses without repeating unnecessary information or phrases such as "Berdasarkan informasi yang diberikan sebelumnya.", "dalam konteks yang diberikan.", "dalam konteks yang tersedia."
   //       AI is a well-behaved and well-mannered individual.
   //       AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
   //       AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
   //       AI assistant make answer using Indonesian Language.
   //       AI assistant avoids sounding repetitive and ensures responses sound natural and tailored to each question.
   //       If the context does not provide the answer to question, the AI assistant will say, "Mohon Maaf, tapi saya tidak dapat menjawab pertanyaan tersebut saat ini.".
   //       START CONTEXT BLOCK
   //  ${context}
   //       END OF CONTEXT BLOCK
   //       AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
   //       If the context does not provide the answer to question, the AI assistant will say, "Mohon Maaf, tapi saya tidak dapat menjawab pertanyaan tersebut saat ini.".
   //       AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
   //       AI assistant will not invent anything that is not drawn directly from the context.
   //       `,
   //    };

   //    const response = await openai.chat.completions.create({
   //     model: "chatgpt-4o-latest",
   //     messages: [
   //      prompt,
   //      {
   //       role: "user",
   //       content: message.body,
   //      },
   //     ],
   //    });

   //    //   console.log("🚀 ~ client.on ~ response:", response);
   //    //   console.log("🚀 ~ client.on ~ response:", response.choices[0].message);
   //    message.reply(response.choices[0].message.content);
  } catch (error) {
   console.log("🚀 ~ client.on ~ error:", error);
  }
 }
});

client.initialize();

export default client;
