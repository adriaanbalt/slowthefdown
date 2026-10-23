import { describe, expect, it } from "vitest";

import {
	isNewBest,
	mergeHighscore,
	parseHighscore,
	sortLeaderboard,
	toLeaderboardEntry,
} from "../highscoreMerge";

describe("parseHighscore", () => {
	it("accepts numbers and numeric strings (the old SecureStore format)", () => {
		expect(parseHighscore(347)).toBe(347);
		expect(parseHighscore("347")).toBe(347);
	});

	it("treats missing, junk and negative values as 0", () => {
		expect(parseHighscore(undefined)).toBe(0);
		expect(parseHighscore(null)).toBe(0);
		expect(parseHighscore("abc")).toBe(0);
		expect(parseHighscore(-5)).toBe(0);
		expect(parseHighscore(Number.NaN)).toBe(0);
	});
});

describe("mergeHighscore", () => {
	it("keeps the server score when it is higher", () => {
		expect(mergeHighscore("120", 300)).toEqual({ highscore: 300, pushToServer: false });
	});

	it("pushes a better offline score to the server", () => {
		expect(mergeHighscore("500", 300)).toEqual({ highscore: 500, pushToServer: true });
	});

	it("pushes when the server has no score yet", () => {
		expect(mergeHighscore("42", undefined)).toEqual({ highscore: 42, pushToServer: true });
	});

	it("does not push when equal or both empty", () => {
		expect(mergeHighscore(300, 300).pushToServer).toBe(false);
		expect(mergeHighscore(null, null)).toEqual({ highscore: 0, pushToServer: false });
	});
});

describe("isNewBest", () => {
	it("is true only when strictly above every known best", () => {
		expect(isNewBest(301, 300, "250")).toBe(true);
		expect(isNewBest(300, 300)).toBe(false);
		expect(isNewBest(10, undefined)).toBe(true);
		expect(isNewBest(0)).toBe(false);
	});
});

describe("leaderboard", () => {
	it("normalises raw user records", () => {
		expect(toLeaderboardEntry("u1", { displayName: "Ada", highscore: "77", lastLoginAt: 1 })).toEqual({
			uid: "u1",
			displayName: "Ada",
			highscore: 77,
		});
		expect(toLeaderboardEntry("u2", null)).toEqual({ uid: "u2", displayName: "", highscore: 0 });
	});

	it("sorts by highscore, highest first, without mutating the input", () => {
		const input = [
			{ uid: "a", displayName: "", highscore: 5 },
			{ uid: "b", displayName: "", highscore: 50 },
			{ uid: "c", displayName: "", highscore: 20 },
		];
		expect(sortLeaderboard(input).map((e) => e.uid)).toEqual(["b", "c", "a"]);
		expect(input[0]?.uid).toBe("a");
	});
});
