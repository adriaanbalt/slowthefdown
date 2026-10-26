/**
 * Firebase phone auth returns from its reCAPTCHA fallback via `<scheme>://firebaseauth/link?...`.
 * Firebase consumes that URL natively, but iOS still forwards it to Expo Router, which has no
 * matching route. Matched by regex because React Native's `URL` does not implement `hostname`.
 */
const FIREBASE_AUTH_URL = /^[a-z][a-z0-9+.-]*:\/\/firebaseauth(?:[/?#]|$)/i;

export function isFirebaseAuthRedirect(url: string): boolean {
	return FIREBASE_AUTH_URL.test(url);
}

/** Returns the path Expo Router should open, or null to leave navigation untouched. */
export function routableSystemPath(path: string): string | null {
	return isFirebaseAuthRedirect(path) ? null : path;
}
