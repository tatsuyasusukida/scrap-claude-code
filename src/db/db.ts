import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { DB } from "./types";

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new SQLite(process.env.DATABASE_URL),
  }),
});
