import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { suggestDreamPins } from "../ai/vision-ideas.server";

// Client-importable server function: suggests AI dream pins for the vision board.
// The AI call itself lives in vision-ideas.server.ts (server-only).
export const getDreamPinIdeas = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      pins: z.array(z.string()).max(50).default([]),
      goals: z.array(z.string()).max(50).default([]),
    }),
  )
  .handler(async ({ data }) => {
    return suggestDreamPins(data.pins ?? [], data.goals ?? []);
  });
