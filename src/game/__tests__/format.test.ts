import { describe, expect, it } from "vitest";
import { formatFocusTime, formatStoredScore, formatTimerMs } from "../format";

describe("formatTimerMs", () => {
	it.each([
		[0, "00000000"],
		[7, "00000007"],
		[1234, "00001234"],
		[99999999, "99999999"],
		[100_000_000, "99999999"],
		[-1, "00000000"],
	])("%i ms -> %s", (ms, expected) => {
		expect(formatTimerMs(ms)).toBe(expected);
	});
});

describe("formatStoredScore", () => {
	it("maps tenths to the same 8-digit ms display", () => {
		expect(formatStoredScore(1234)).toBe("00123400");
	});
});

describe("formatFocusTime", () => {
	it.each([
		[0, "0:00.0"],
		[7, "0:00.7"],
		[100, "0:10.0"],
		[1234, "2:03.4"],
		[36000, "60:00.0"],
		[-5, "0:00.0"],
	])("%i tenths -> %s", (tenths, expected) => {
		expect(formatFocusTime(tenths)).toBe(expected);
	});
});
