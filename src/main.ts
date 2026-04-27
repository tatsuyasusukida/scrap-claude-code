import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { DB } from "./db/types";

async function main() {
  const db = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(process.env.DATABASE_URL),
    }),
  });

  const requests = await db.selectFrom("requests").selectAll().execute();

  for (const request of requests) {
    console.log(request.prompt);
  }
}

main().catch(console.error);
