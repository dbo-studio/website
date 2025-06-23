import {
	bigint,
	boolean,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const releases = pgTable("releases", {
	id: bigint("id", { mode: "number" }).primaryKey(),
	tagName: varchar("tag_name", { length: 255 }).notNull(),
	name: varchar("name", { length: 500 }),
	body: text("body"),
	draft: boolean("draft").default(false),
	prerelease: boolean("prerelease").default(false),
	publishedAt: timestamp("published_at"),
	assets: jsonb("assets").$type<Array<{
		name: string;
		browser_download_url: string;
		size: number;
		content_type: string;
	}> | null>(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type Release = typeof releases.$inferSelect;
export type NewRelease = typeof releases.$inferInsert;

export type Asset = {
	name: string;
	browser_download_url: string;
	size: number;
	content_type: string;
};
