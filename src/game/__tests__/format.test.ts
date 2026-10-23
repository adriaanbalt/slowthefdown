import { describe, expect, it } from "vitest";
import { formatFocusTime } from "../format";

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
