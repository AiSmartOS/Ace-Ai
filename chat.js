import { GoogleGenAI } from "@google/genai";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function startChatSession() {
  const rl = readline.createInterface({ input, output });

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are ACE, an AI assistant powered by AiSmartOS.",
      },
    });

    console.log("--- Ace AI Session Started (Type 'exit' to quit) ---\n");

    while (true) {
      const userInput = await rl.question("\nYou: ");

      if (userInput.trim().toLowerCase() === "exit") {
        console.log("\nEnding conversation. Goodbye!");
        break;
      }

      if (!userInput.trim()) continue;

      process.stdout.write("ACE: ");

      const resultStream = await chat.sendMessageStream({ message: userInput });

      for await (const chunk of resultStream) {
        process.stdout.write(chunk.text);
      }

      console.log();
    }
  } catch (error) {
    console.error("\nError:", error.message);
  } finally {
    rl.close();
  }
}

startChatSession();
