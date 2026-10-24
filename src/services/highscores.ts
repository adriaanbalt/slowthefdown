import { updateUser } from "./firebase";
import { isNewBest, mergeHighscore } from "./highscoreMerge";
import {
	readLocalFocusHighscore,
	readLocalHighscore,
	writeLocalFocusHighscore,
	writeLocalHighscore,
} from "./localHighscore";

export async function submitClassicScore(
	tenths: number,
	uid: string | null,
	currentBest: number,
): Promise<number | null> {
	const local = await readLocalHighscore();
	if (!isNewBest(tenths, local, currentBest)) return null;
	await writeLocalHighscore(tenths);
	if (uid) await updateUser(uid, { highscore: tenths });
	return tenths;
}

export async function submitFocusScore(
	tenths: number,
	uid: string | null,
	currentBest: number,
): Promise<number | null> {
	const local = await readLocalFocusHighscore();
	if (!isNewBest(tenths, local, currentBest)) return null;
	await writeLocalFocusHighscore(tenths);
	if (uid) await updateUser(uid, { focusHighscore: tenths });
	return tenths;
}

export { mergeHighscore };
