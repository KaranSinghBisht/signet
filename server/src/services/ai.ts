import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config.js";

interface AIResponse {
  answer: string;
  model: string;
}

let groqClient: Groq | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

function getGroq(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: config.groqApiKey });
  }
  return groqClient;
}

function getGemini(): GoogleGenerativeAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return geminiClient;
}

async function queryGroq(
  systemPrompt: string,
  question: string,
): Promise<AIResponse> {
  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    max_tokens: 1024,
    temperature: 0.7,
  });
  return {
    answer: completion.choices[0]?.message?.content || "No response generated.",
    model: "llama-3.3-70b-versatile",
  };
}

async function queryGemini(
  systemPrompt: string,
  question: string,
): Promise<AIResponse> {
  const genai = getGemini();
  const model = genai.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(question);
  return {
    answer: result.response.text() || "No response generated.",
    model: "gemini-2.0-flash",
  };
}

export async function queryAI(
  systemPrompt: string,
  question: string,
): Promise<AIResponse> {
  if (config.aiProvider === "gemini" && config.geminiApiKey) {
    return queryGemini(systemPrompt, question);
  }
  return queryGroq(systemPrompt, question);
}
