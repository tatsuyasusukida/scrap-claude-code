import { query } from "@anthropic-ai/claude-agent-sdk";
import { outputJsonSchema } from "./output-schema";

async function main() {
  for await (const message of query({
    prompt: `
      あなたはテキストから名前と住所を抽出する API です。
      次のテキストから名前と住所を抽出してください。

      私の名前は山田太郎です。
      私の住所は東京都千代田区永田町1-7-1です。
    `,
    options: {
      outputFormat: {
        type: "json_schema",
        schema: outputJsonSchema,
      },
    },
  })) {
    if (
      message.type === "result" &&
      message.subtype === "success" &&
      message.structured_output
    ) {
      console.log(JSON.stringify(message.structured_output, null, 2));
    }
  }
}

main().catch(console.error);
