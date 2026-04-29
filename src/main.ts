import { db } from "./db/db";
import { processRequest } from "./worker";

let shuttingDown = false;
process.on("SIGINT", () => {
  shuttingDown = true;
});
process.on("SIGTERM", () => {
  shuttingDown = true;
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function main() {
  console.log("[orchestrator] started");

  while (!shuttingDown) {
    const req = await db
      .selectFrom("requests")
      .select(["id", "prompt"])
      .where("status", "=", "pending")
      .orderBy("id", "asc")
      .limit(1)
      .executeTakeFirst();

    if (!req) {
      await sleep(1000);
      continue;
    }

    await db
      .updateTable("requests")
      .set({ status: "processing", updated_at: new Date().toISOString() })
      .where("id", "=", req.id)
      .execute();

    await processRequest(req);
  }

  await db.destroy();
  console.log("[orchestrator] stopped");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
