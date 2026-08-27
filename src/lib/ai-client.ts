export type AiFeature = "email" | "meeting" | "planner" | "research" | "chat";
export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function streamAi(
  body: { feature: AiFeature; input?: string; messages?: ChatTurn[] },
  onDelta: (full: string) => void,
): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const message = (await res.text().catch(() => "")) || "The AI service is unavailable.";
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onDelta(full);
  }
  if (!full.trim()) throw new Error("The assistant returned an empty response. Try regenerating.");
  return full;
}
