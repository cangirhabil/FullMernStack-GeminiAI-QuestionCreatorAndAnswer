import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export function getStorageStrategy(): "local" | "database" {
	const strategy = process.env.STORAGE_STRATEGY?.toLowerCase();
	if (strategy === "database") return "database";
	if (strategy === "local") return "local";
	// On Vercel default to database to avoid ephemeral FS
	if (process.env.VERCEL) return "database";
	return "local";
}

export async function saveLocalFile(filename: string, bytes: Buffer) {
	const uploadsDir = join(process.cwd(), "uploads");
	if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
	const filepath = join(uploadsDir, filename);
	await writeFile(filepath, bytes);
	return filepath;
}
