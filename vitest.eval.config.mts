import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Separate config so `npm test` never spends credits.
 *
 * Everything runs on a single worker, one file at a time: the chat endpoint
 * rate-limits to 12 requests per minute, and parallel cases would report
 * refusals that are really 429s.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["evals/**/*.eval.ts"],
    // A slow agent turn plus the pacing delay.
    testTimeout: 90_000,
    hookTimeout: 30_000,
    // Files run one after another; cases inside a file are sequential unless
    // marked `.concurrent`, which none of them are.
    fileParallelism: false,
    sequence: { concurrent: false },
    maxWorkers: 1,
    /**
     * The model is non-deterministic: a single sample is not evidence of a
     * behaviour, only of one draw from it. A case that passes on any of three
     * attempts reflects "the agent generally does this"; one that fails all
     * three is a real regression.
     */
    retry: 2,
  },
});
