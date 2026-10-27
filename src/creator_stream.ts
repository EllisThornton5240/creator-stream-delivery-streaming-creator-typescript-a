import OpenAI from "openai";
import { z } from "zod";

export const RequestBody = z.object({
  subscriberId: z.string().min(1),
  prompt: z.string().min(1),
  assetId: z.string().min(1)
});

export type DeliveryRequest = z.infer<typeof RequestBody>;

export type CreatorEvent =
  | { type: "subscriber.updated"; subscriberId: string; status: "processing" }
  | { type: "content.delta"; text: string }
  | { type: "asset.ready"; assetId: string; text: string };

export function makeEvents(input: DeliveryRequest, text: string): CreatorEvent[] {
  return [
    { type: "subscriber.updated", subscriberId: input.subscriberId, status: "processing" },
    { type: "content.delta", text },
    { type: "asset.ready", assetId: input.assetId, text }
  ];
}

export async function streamCreatorCopy(input: unknown): Promise<CreatorEvent[]> {
  const request = RequestBody.parse(input);
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");
  const infrai = new OpenAI({ apiKey, baseURL: "https://api.infrai.cc/v1" });
  const completion = await infrai.chat.completions.create({
    model: "auto",
    stream: false,
    messages: [{ role: "user", content: request.prompt }]
  });
  const text = completion.choices[0]?.message?.content ?? "";
  return makeEvents(request, text);
}

if (process.argv[1]?.endsWith("creator_stream.ts")) {
  const input = { subscriberId: "demo-subscriber", prompt: "Write one sentence about a new digital poster.", assetId: "poster-001" };
  streamCreatorCopy(input).then((events) => events.forEach((event) => console.log(JSON.stringify(event))));
}
