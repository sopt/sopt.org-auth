import { SoptUser } from "../__generated__/psql";
import { Database } from "../database";

export interface UserRepository {
  getUserByUserId(userId: number): Promise<SoptUser | null>;
  createUser(init: { name?: string }): Promise<{ userId: number }>;
}

export function createUserRepository(db: Database): UserRepository {
  return {
    async getUserByUserId(userId) {
      const ret = await db.selectFrom("sopt_user").where("id", "=", userId).selectAll().executeTakeFirst();
      return ret ?? null;
    },
    async createUser(init) {
      const { id } = await db
        .insertInto("sopt_user")
        .values({
          bio: "",
          name: init.name ?? "",
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      return {
        userId: Number(id),
      };
    },
  };
}
