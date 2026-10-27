import { describe, expect, it } from "vitest";

import { compareVersions, isStoreNewer } from "./appStoreVersion";

describe("compareVersions", () => {
	it("orders by numeric part, not string", () => {
		expect(compareVersions("10.0.3", "9.9.9")).toBeGreaterThan(0);
		expect(compareVersions("1.2.0", "1.10.0")).toBeLessThan(0);
	});

	it("treats missing parts as zero", () => {
		expect(compareVersions("10.0", "10.0.0")).toBe(0);
		expect(compareVersions("10.0.1", "10.0")).toBeGreaterThan(0);
	});
});

describe("isStoreNewer", () => {
	it("is true only when the store version is strictly higher", () => {
		expect(isStoreNewer("10.0.3", "10.0.4")).toBe(true);
		expect(isStoreNewer("10.0.3", "10.0.3")).toBe(false);
		expect(isStoreNewer("10.0.3", "10.0.2")).toBe(false);
	});
});
