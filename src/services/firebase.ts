import {
	getAuth,
	onAuthStateChanged,
	signInWithPhoneNumber,
	signOut,
	type ConfirmationResult,
	type User,
} from "@react-native-firebase/auth";
import { get, getDatabase, onValue, orderByChild, query, ref, update } from "@react-native-firebase/database";

import { toLeaderboardEntry, type LeaderboardEntry } from "./highscoreMerge";

export type { ConfirmationResult, User };

const auth = getAuth();
const db = getDatabase();

export function watchAuth(listener: (user: User | null) => void): () => void {
	return onAuthStateChanged(auth, listener);
}

export function currentUid(): string | null {
	return auth.currentUser?.uid ?? null;
}

export function requestPhoneCode(phoneNumberE164: string): Promise<ConfirmationResult> {
	return signInWithPhoneNumber(auth, phoneNumberE164);
}

export function logOut(): Promise<void> {
	return signOut(auth);
}

export interface UserRecord {
	uid?: string;
	displayName?: string;
	highscore?: number;
	focusHighscore?: number;
	lastLoginAt?: number;
}

export async function fetchUser(uid: string): Promise<UserRecord | null> {
	const snapshot = await get(ref(db, `users/${uid}`));
	return (snapshot.val() as UserRecord | null) ?? null;
}

export function updateUser(uid: string, values: UserRecord): Promise<void> {
	return update(ref(db, `users/${uid}`), { uid, ...values });
}

function watchOrdered(
	childKey: "highscore" | "focusHighscore",
	listener: (entries: LeaderboardEntry[]) => void,
	onError: (error: Error) => void,
): () => void {
	return onValue(
		query(ref(db, "users"), orderByChild(childKey)),
		(snapshot) => {
			const entries: LeaderboardEntry[] = [];
			snapshot.forEach((child) => {
				if (!child.key) return undefined;
				const val = child.val() as Record<string, unknown> | null;
				if (childKey === "focusHighscore" && !(val && "focusHighscore" in val)) {
					return undefined;
				}
				entries.push(toLeaderboardEntry(child.key, val, childKey));
				return undefined;
			});
			listener(entries);
		},
		onError,
	);
}

export function watchLeaderboard(
	listener: (entries: LeaderboardEntry[]) => void,
	onError: (error: Error) => void,
): () => void {
	return watchOrdered("highscore", listener, onError);
}

export function watchFocusLeaderboard(
	listener: (entries: LeaderboardEntry[]) => void,
	onError: (error: Error) => void,
): () => void {
	return watchOrdered("focusHighscore", listener, onError);
}
