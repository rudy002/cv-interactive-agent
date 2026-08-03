"use client";

import { useEffect, useState } from "react";

export type LoadingStage = "reading" | "searching" | "writing" | "slow";

/**
 * Thresholds chosen from measured behaviour: the n8n workflow answers in 5–10s,
 * so the labels track the real pipeline (embed → retrieve → generate) instead of
 * showing ten seconds of identical dots, which reads as "the site is broken".
 */
const STAGES: { after: number; stage: LoadingStage }[] = [
  { after: 0, stage: "reading" },
  { after: 1_200, stage: "searching" },
  { after: 4_000, stage: "writing" },
  { after: 13_000, stage: "slow" },
];

export const STAGE_LABELS: Record<LoadingStage, string> = {
  reading: "Reading your question…",
  searching: "Searching my CV and projects…",
  writing: "Writing the answer…",
  slow: "Still working — this one is taking longer than usual…",
};

export function useLoadingStage(isLoading: boolean): LoadingStage {
  const [stage, setStage] = useState<LoadingStage>("reading");

  useEffect(() => {
    if (!isLoading) return;

    // One timer per threshold: no polling, and each fires exactly once.
    const timers = STAGES.filter((entry) => entry.after > 0).map((entry) =>
      setTimeout(() => setStage(entry.stage), entry.after),
    );

    return () => {
      timers.forEach(clearTimeout);
      // Rewind in the cleanup so the next question starts from the first stage.
      setStage("reading");
    };
  }, [isLoading]);

  // Guarded read: never surface a stale stage between two questions.
  return isLoading ? stage : "reading";
}
