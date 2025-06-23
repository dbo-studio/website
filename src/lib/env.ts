import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	API_SYNC_TOKEN: z.string().min(1, "API_SYNC_TOKEN is required"),
	DATABASE_URL: z.string(),
	NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
