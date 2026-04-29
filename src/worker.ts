import { query } from "@anthropic-ai/claude-agent-sdk";
import { db } from "./db/db";
import { orchestratorOutputSchema, outputJsonSchema } from "./output-schema";

type Request = { id: number; prompt: string };

export async function processRequest(req: Request): Promise<void> {
  const events: unknown[] = [];

  let resultText: string | null = null;
  let errorMessage: string | null = null;
  let errorStack: string | null = null;

  try {
    for await (const message of query({
      prompt: req.prompt,
      options: {
        outputFormat: { type: "json_schema", schema: outputJsonSchema },
      },
    })) {
      events.push(message);

      if (message.type !== "result") continue;

      if (message.subtype === "success" && message.structured_output) {
        const parsed = orchestratorOutputSchema.parse(
          message.structured_output,
        );
        if (parsed.success) {
          resultText = parsed.final_output;
        } else {
          errorMessage = `LLM reported failure: ${parsed.final_output}`;
        }
      } else {
        errorMessage = `LLM error: ${message.subtype}`;
      }
    }
  } catch (e) {
    const err = e as Error;
    errorMessage = err.message;
    errorStack = err.stack ?? null;
  }

  const ok = resultText !== null && errorMessage === null;
  const eventsJson = safeStringify(events);
  const now = new Date().toISOString();

  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("responses")
      .values({
        request_id: req.id,
        events: eventsJson,
        result: resultText,
        error_message: errorMessage,
        error_stack: errorStack,
      })
      .execute();

    await trx
      .updateTable("requests")
      .set({ status: ok ? "done" : "error", updated_at: now })
      .where("id", "=", req.id)
      .execute();
  });

  console.log(
    `[worker] request#${req.id} -> ${ok ? "done" : "error"}` +
      (errorMessage ? ` (${errorMessage})` : ""),
  );
}

function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>();
  return JSON.stringify(value, (_key, v) => {
    if (typeof v === "object" && v !== null) {
      if (seen.has(v)) return "[Circular]";
      seen.add(v);
    }
    return v;
  });
}
