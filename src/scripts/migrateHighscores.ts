/**
 * One-time Firebase Admin migration: copy users highscore into focusHighscore
 * wherever focusHighscore is empty.
 *
 * Usage (from src/):
 *   GOOGLE_APPLICATION_CREDENTIALS=../.secrets/firebase-adminsdk.json
 *     npx tsx scripts/migrateHighscores.ts --dry-run
 *
 * Writes a JSON backup before mutating. Production runs require dropping
 * --dry-run and explicit operator approval.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dryRun = process.argv.includes("--dry-run");

async function main() {
	const admin = await import("firebase-admin");
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.applicationDefault(),
			databaseURL:
				process.env.FIREBASE_DATABASE_URL ?? "https://slowitdown-d1ac8.firebaseio.com",
		});
	}

	const db = admin.database();
	const snap = await db.ref("users").once("value");
	const users = (snap.val() ?? {}) as Record<
		string,
		{ highscore?: number; focusHighscore?: number; displayName?: string }
	>;

	const backupDir = join(dirname(fileURLToPath(import.meta.url)), "../../.secrets");
	mkdirSync(backupDir, { recursive: true });
	const backupPath = join(backupDir, `users-backup-${Date.now()}.json`);
	writeFileSync(backupPath, JSON.stringify(users, null, 2));
	console.log(`Backup written to ${backupPath}`);

	let wouldUpdate = 0;
	let updated = 0;
	for (const [uid, user] of Object.entries(users)) {
		const classic = Number(user.highscore) || 0;
		const focus = Number(user.focusHighscore) || 0;
		if (classic <= 0 || focus > 0) continue;
		wouldUpdate += 1;
		if (dryRun) {
			console.log(`[dry-run] ${uid} highscore=${classic} -> focusHighscore`);
			continue;
		}
		await db.ref(`users/${uid}`).update({ focusHighscore: classic });
		updated += 1;
		console.log(`Updated ${uid}`);
	}

	console.log(
		dryRun
			? `Dry run complete. Would update ${wouldUpdate} users.`
			: `Done. Updated ${updated} users.`,
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
