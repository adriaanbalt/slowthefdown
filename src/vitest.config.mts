import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["game/**/*.test.ts", "services/**/*.test.ts"],
	},
});
