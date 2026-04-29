import { z } from "zod";

export const orchestratorOutputSchema = z.object({
  success: z.boolean().describe("タスクが期待通り完了したか"),
  final_output: z.string().describe("利用者に返す最終出力テキスト"),
});

export type OrchestratorOutput = z.infer<typeof orchestratorOutputSchema>;

// $schema があると Structured Output が動作しないので削除する。
const { $schema, ...outputJsonSchema } = z.toJSONSchema(
  orchestratorOutputSchema,
);

export { outputJsonSchema };
