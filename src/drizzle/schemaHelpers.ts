import { timestamp, uuid } from "drizzle-orm/pg-core";

export const timeStamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const id = uuid().primaryKey().defaultRandom();
