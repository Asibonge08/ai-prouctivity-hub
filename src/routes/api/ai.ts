import { createFileRoute } from "@tanstack/react-router";
import { systemPromptFor, type AiFeature } from "@/lib/ai-prompts.server";

type ChatTurn = { role: "user" | "assistant"; content: string };
type Body = { feature?: AiFeature; input?: string; messages?: ChatTurn[] };

const VALID: AiFeature[] = ["email", "meeting", "planner", "research", "chat"];

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as Body | null;
        const feature = body?.feature;
        if (!feature || !VALID.includes(feature)) {
          return new Response("Unknown AI feature requested.", { status: 400 });
        }

        const turns: ChatTurn[] =
          body?.messages && body.messages.length > 0
            ? body.messages
            : body?.input
              ? [{ role: "user", content: body.input }]
              : [];

        if (turns.length === 0) {
          return new Response("Please add some input before generating.", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("AI is not configured for this workspace.", { status: 500 });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-5.6-terra",
            instructions: systemPromptFor(feature),
            input: turns.map((t) => ({
              role: t.role,
              content: [
                {
                  type: t.role === "assistant" ? "output_text" : "input_text",
                  text: t.content,
                },
              ],
            })),
            store: false,
            reasoning: { effort: "low" },
            stream: true,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          let message = "The AI service could not complete this request.";
          if (upstream.status === 429)
            message = "Too many requests right now. Please wait a moment and try again.";
          if (upstream.status === 402)
            message = "AI credits are exhausted for this workspace. Add credits to continue.";
          if (upstream.status === 403) message = "AI access is currently blocked for this workspace.";
          console.error("AI gateway error", upstream.status, detail);
          return new Response(message, { status: upstream.status || 500 });
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = upstream.body.getReader();

        const stream = new ReadableStream<Uint8Array>({
          async pull(controller) {
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";
              for (const line of lines) {
                if (!line.startsWith("data:")) continue;
                const payload = line.slice(5).trim();
                if (!payload || payload === "[DONE]") continue;
                try {
                  const event = JSON.parse(payload) as { type?: string; delta?: string };
                  if (event.type === "response.output_text.delta" && event.delta) {
                    controller.enqueue(encoder.encode(event.delta));
                  }
                } catch {
                  /* ignore partial frames */
                }
              }
            }
          },
          cancel() {
            void reader.cancel();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
