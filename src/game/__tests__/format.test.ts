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
	it.each([
		[0, "0:00"],
		[7, "0:00"],
		[10, "0:01"],
		[50, "0:05"],
		[600, "1:00"],
		[1234, "2:03"],
		[35999, "59:59"],
		[36000, "1:00:00"],
		[36610, "1:01:01"],
		[360000, "10:00:00"],
		[-5, "0:00"],
	])("%i tenths -> %s", (tenths, expected) => {
		expect(formatStoredScore(tenths)).toBe(expected);
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
