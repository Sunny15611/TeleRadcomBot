// "use server";

// import { revalidatePath } from "next/cache";

// import { Chat, Feedback, Message } from "@/models";
// import dbConnect from "@/lib/mongodb";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

// export async function fetchChats(offset: number = 0, limit: number = 20) {
//   const session = await auth();
//   if (!session) throw new Error("Unauthorized");

//   await dbConnect();

//   const chats = await Chat.find({ userId: session.user.id })
//     .lean()
//     .sort({ createdAt: -1 })
//     .skip(offset)
//     .limit(limit)
//     .select("title createdAt");

//   revalidatePath("/api/chats");
//   console.log(chats);

//   return JSON.stringify(chats);
// }

// export async function fetchMessages(chatId: string) {
//   const session = await auth();

//   if (!session) throw new Error("Unauthorized");

//   await dbConnect();

//   const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).lean();
//   console.log(messages);

//   return JSON.stringify(messages);
// }

// type IfMessage = {
//   chatId: string | undefined;
//   content: string;
//   query: string;
//   // data: string;
//   imageData?: string;
//   Documents?: string;
// };
// export async function savemessage({ chatId, content, query }: IfMessage) {
//   console.log(chatId, content, query);
//   try {
//     const session = await auth();

//     if (!session) throw new Error("Unauthorized");

//     await dbConnect();

//     let chat;
//     if (!chatId) {
//       chat = await Chat.create({
//         userId: session.user.id,
//         title: content.slice(0, 50), // Use first 50 chars of message as chat title
//       });
//       chatId = chat.id;
//     } else {
//       chat = await Chat.findById(chatId);
//       if (!chat) throw new Error("Chat not found");
//     }
//     // const procesdata = JSON.parse(data);
//     const userMessage = new Message({
//       chatId,
//       content: query,
//       role: "user",
//     });
//     const aiMessage = new Message({
//       chatId,
//       content: `${content}`,
//       role: "assistant",
//       // Documents:procesdata.Documents,
//       // imageData:procesdata.imageData
//     });
//     // revalidatePath(`/chat/${chatId}`);
//     await userMessage.save(), await aiMessage.save();
//     // Save both messages simultaneously

//     return "this is messsage from save message";
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.log(error.message);
//     } else {
//       console.error("An unexpected error occurred:", error);
//     }
//     // console.log(error.message);
//   }
// }
// export async function sendMessage({
//   chatId,
//   content,
//   query,
//   Documents,
//   imageData,
// }: IfMessage) {
//   const session = await auth();

//   if (!session) throw new Error("Unauthorized");

//   await dbConnect();

//   let chat;
//   let check = false;
//   if (!chatId) {
//     check = true;
//     chat = await Chat.create({
//       userId: session.user.id,
//       title: content.slice(0, 50), // Use first 50 chars of message as chat title
//     });
//     chatId = chat.id;
//   } else {
//     chat = await Chat.findById(chatId);
//     if (!chat) throw new Error("Chat not found");
//   }

//   const userMessage = await Message.create({
//     chatId,
//     content: query,
//     role: "user",
//   });

//   // Here you would typically call your AI service to get a response
//   // For this example, we'll just echo the user's message
//   // const procesdata = JSON.parse(data);
//   console.log(Documents, imageData);

//   const aiMessage = await Message.create({
//     chatId,
//     content: ` ${content}`,
//     role: "assistant",
//     Documents: JSON.parse(Documents!),

//     imageData: JSON.parse(imageData!),
//   });

//   revalidatePath(`/chat/${chatId}`);
//   if (check) {
//     redirect(`/chat/${chatId}`);
//   }
//   return { userMessage, aiMessage };
// }

// //user feedback
// export const saveFeedback = async ({
//   messageId,
//   feedback,
// }: {
//   messageId: string;
//   feedback: any;
// }) => {
//   try {
//     const session = await auth();
//     if (!session) throw new Error("Unauthorized");

//     await dbConnect();
//     const newfeedback = await Feedback.create({
//       useremail: session.user.email,
//       messageId: messageId,
//       feedback: feedback,
//     });

//     return JSON.stringify(newfeedback);
//   } catch (error) {
//     throw new Error(JSON.stringify(error));
//   }
// };




"use server";

import { revalidatePath } from "next/cache";

import { Chat, Feedback, Message } from "@/models";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function fetchChats(offset: number = 0, limit: number = 20) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();

  const chats = await Chat.find({ userId: session.user.id })
    .lean()
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .select("title createdAt");

  revalidatePath("/api/chats");
  console.log(chats);

  return JSON.stringify(chats);
}

export async function fetchMessages(chatId: string) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  await dbConnect();

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).lean();
  console.log(messages);

  return JSON.stringify(messages);
}

type IfMessage = {
  chatId: string | undefined;
  content: string;
  query: string;
  // data: string;
  imageData?: string;
  Documents?: string;
};

export async function savemessage({ chatId, content, query }: IfMessage) {
  console.log(chatId, content, query);

  try {
    const session = await auth();

    if (!session) throw new Error("Unauthorized");

    await dbConnect();

    let chat;
    if (!chatId) {
      chat = await Chat.create({
        userId: session.user.id,
        title: content.slice(0, 50), // Use first 50 chars of message as chat title
      });
      chatId = chat.id;
    } else {
      chat = await Chat.findById(chatId);
      if (!chat) throw new Error("Chat not found");
    }
    // const procesdata = JSON.parse(data);
    const userMessage = new Message({
      chatId,
      content: query,
      role: "user",
    });
    const aiMessage = new Message({
      chatId,
      content: `${content}`,
      role: "assistant",
      // Documents:procesdata.Documents,
      // imageData:procesdata.imageData
    });
    // revalidatePath(`/chat/${chatId}`);
    await userMessage.save(), await aiMessage.save();
    // Save both messages simultaneously

    return "this is messsage from save message";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    // console.log(error.message);
  }
}


let questions="";
let Res="";
export async function sendMessage({
  chatId,
  content,
  query: userQuery,
  Documents,
  imageData,
}: {
  chatId?: string;
  content: string;
  query: string;
  Documents?: string;
  imageData?: string;
}) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    await dbConnect();

    let chat;
    let isNewChat = false;
   questions=userQuery;
   Res=content;
    if (!chatId) {
      isNewChat = true;
      chat = await Chat.create({
        userId: session.user.id,
        title: userQuery.slice(0, 50),
        latestQuery: userQuery,
        latestResponse: content,
      });
      chatId = chat.id;
    } else {
      chat = await Chat.findById(chatId);
      if (!chat) throw new Error("Chat not found");

      // Update latest query & response for existing chat
      await Chat.findByIdAndUpdate(chatId, {
        latestQuery: userQuery,
        latestResponse: content,
      });
    }

    // Save user and assistant messages
    const userMessage = await Message.create({
      chatId,
      content: userQuery,
      role: "user",
    });

    const aiMessage = await Message.create({
      chatId,
      content,
      role: "assistant",
      Documents: Documents ? JSON.parse(Documents) : undefined,
      imageData: imageData ? JSON.parse(imageData) : undefined,
    });

    revalidatePath(`/chat/${chatId}`);
    if (isNewChat) {
      redirect(`/chat/${chatId}`);
    }

    return { userMessage, aiMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}


//user feedback
// export const saveFeedback = async ({
//   messageId,
//   feedback,
// }: {
//   messageId: any;
//   feedback: any;
// }) => {
//   try {
//     const session = await auth();
//     if (!session) throw new Error("Unauthorized");

//     await dbConnect();
//     const newfeedback = await Feedback.create({
//       useremail: session.user.email,
//       messageId: messageId,
//       feedback: feedback,
//     });
//     console.log(`${question} and anser ${response}`);
//     console.log(`the objecty sis ${newfeedback}`)
//     return JSON.stringify(newfeedback);
//   } catch (error) {
//     throw new Error(JSON.stringify(error));
//   }
// };



export async function saveFeedback({ messageId,feedback }: { messageId:any,feedback: any }) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    await dbConnect();

    // Save feedback along with latest query and response
    const newFeedback = await Feedback.create({
      useremail: session.user.email,
      feedback:feedback,
      question: questions,
      response: Res
    });

    console.log(`Feedback saved: ${newFeedback}`);
    return JSON.stringify(newFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw new Error("Failed to save feedback");
  }
}

