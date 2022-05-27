import { Kysely, PostgresDialect } from "kysely";

import { FacebookAuth, SoptUser } from "../__generated__/psql";

export interface DatabaseSchema {
  sopt_user: SoptUser;
  facebook_auth: FacebookAuth;
}

export type Database = Kysely<DatabaseSchema>;

interface CreateDatabaseDeps {
  DATABASE_URI: string;
}

export function createDatabase({ DATABASE_URI }: CreateDatabaseDeps): Database {
  const db = new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      connectionString: DATABASE_URI,
    }),
  });

  return db;
}
