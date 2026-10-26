import { describe, expect, it } from "vitest";

import { isFirebaseAuthRedirect, routableSystemPath } from "../deepLinks";

describe("isFirebaseAuthRedirect", () => {
	it("matches Firebase reCAPTCHA returns on both registered schemes", () => {
		expect(
			isFirebaseAuthRedirect(
				"app-1-1065043807084-ios-4ff2d5b30ba5d11b://firebaseauth/link?deep_link_id=https%3A%2F%2Fx",
			),
		).toBe(true);
		expect(
			isFirebaseAuthRedirect("com.googleusercontent.apps.1065043807084-abc://firebaseauth/link"),
		).toBe(true);
		expect(isFirebaseAuthRedirect("slowthefdown://FirebaseAuth?x=1")).toBe(true);
	});

	it("leaves app deep links alone", () => {
		expect(isFirebaseAuthRedirect("slowthefdown:///")).toBe(false);
		expect(isFirebaseAuthRedirect("slowthefdown://times")).toBe(false);
		expect(isFirebaseAuthRedirect("slowthefdown://firebaseauthx/link")).toBe(false);
		expect(isFirebaseAuthRedirect("/login-phone")).toBe(false);
	});
});

describe("routableSystemPath", () => {
	it("drops Firebase auth redirects and passes everything else through", () => {
		expect(routableSystemPath("app-1-1-ios-a://firebaseauth/link")).toBeNull();
		expect(routableSystemPath("slowthefdown://profile")).toBe("slowthefdown://profile");
	});
});
