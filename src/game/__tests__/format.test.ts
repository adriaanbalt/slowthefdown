import { describe, expect, it } from "vitest";
import { formatFocusTime, formatStoredScore, formatTimerMs } from "../format";

describe("formatTimerMs", () => {
	it.each([
		[0, "00:00:00.000"],
		[7, "00:00:00.007"],
		[1234, "00:00:01.234"],
		[61_005.9, "00:01:01.005"],
		[3_599_999, "00:59:59.999"],
		[3_600_000, "01:00:00.000"],
		[36_000_000, "10:00:00.000"],
		[360_000_000, "100:00:00.000"],
		[-1, "00:00:00.000"],
	])("%d ms -> %s", (ms, expected) => {
		expect(formatTimerMs(ms)).toBe(expected);
	});
});

describe("formatStoredScore", () => {
	it.each([
		[0, "00:00:00.000"],
		[7, "00:00:00.700"],
		[10, "00:00:01.000"],
		[1234, "00:02:03.400"],
		[35999, "00:59:59.900"],
		[36000, "01:00:00.000"],
		[36610, "01:01:01.000"],
		[-5, "00:00:00.000"],
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
