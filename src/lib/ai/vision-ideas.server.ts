import process from "node:process";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayRunIdFetch } from "./run-id";

// Server-only AI helper. The .server.ts suffix keeps this out of the client
// bundle; the API key and model call never reach the browser.
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

// Strict-compatible: one object root, every property required, flat.
const pinIdeasSchema = z.object({
  pins: z.array(
    z.object({
      emoji: z.string(),
      text: z.string(),
      category: z.string(),
    }),
  ),
});

export interface DreamPinIdea {
  emoji: string;
  text: string;
  category: string;
}

const INSTRUCTIONS = `You are a warm, encouraging dream coach for a pastel-dream journaling app called The MindMap Media.
Suggest vision-board ideas (dream pins) tailored to the person's existing dreams and goals.
Write each idea the way the person themselves would pin it: short (3-8 words), hopeful, first-person, concrete.
Give a fitting single emoji for each idea and a short category (like Travel, Creativity, Wellness, Home, Love, Learning, Adventure, Career).
Return exactly 5 pins, each different from what they already have.`;

export async function suggestDreamPins(
  existingPins: string[],
  goals: string[],
): Promise<DreamPinIdea[]> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured yet — no API key on the server.");
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: `${GATEWAY_URL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const existing = existingPins.length
    ? `Dreams already on the board: ${existingPins.map((p) => `"${p}"`).join(", ")}. Avoid repeating or trivially rephrasing these.`
    : "The board is still empty — suggest a beautiful, varied first set.";
  const goalLines = goals.length
    ? `Goals being tracked: ${goals.map((g) => `"${g}"`).join(", ")}. At least two pins should gently support these goals.`
    : "No goals tracked yet.";

  const userPrompt = `${existing}\n${goalLines}\nSuggest 5 new dream pins now.`;

  const result = streamText({
    model: provider.responses(MODEL),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: userPrompt }],
    output: Output.object({ schema: pinIdeasSchema }),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  try {
    const output = await result.output;
    // Clamp/normalize in code — never in the schema.
    return (output.pins ?? [])
      .filter((p) => p && typeof p.text === "string" && p.text.trim().length > 0)
      .slice(0, 5)
      .map((p) => ({
        emoji: (p.emoji || "✨").slice(0, 8),
        text: p.text.trim().slice(0, 80),
        category: p.category?.trim().slice(0, 24) || "Dream",
      }));
  } catch (error) {
    if (typeof error === "object" && error !== null && "text" in error) {
      const raw = (error as { text?: string }).text;
      if (raw) {
        try {
          const parsed = pinIdeasSchema.parse(JSON.parse(raw));
          return parsed.pins.slice(0, 5);
        } catch {
          /* fall through to the real error */
        }
      }
    }
    throw error;
  }
}
