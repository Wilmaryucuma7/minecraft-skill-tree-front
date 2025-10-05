import { useMemo, useCallback } from "react";
import {
  calculateLinesGeometry,
  determineLineState,
  calculateLinePriority,
} from "@/utils";
import type { Achievement, LayoutNode, LineGeometry, LineWithState } from "@/types";

interface UseConnectionLinesResult {
  sortedLines: LineWithState[];
}

export const useConnectionLines = (
  treeLayout: LayoutNode[] | null,
  achievements: Record<string, Achievement>,
  hoveredNodeId: string | null,
): UseConnectionLinesResult => {
  const linesData = useMemo(
    () => calculateLinesGeometry(treeLayout),
    [treeLayout],
  );

  const getLineState = useCallback(
    (line: LineGeometry) =>
      determineLineState(line, achievements, hoveredNodeId),
    [achievements, hoveredNodeId],
  );

  const sortedLines = useMemo<LineWithState[]>(() => {
    // We still compute priority to preserve original layering intent, but discard it after ordering.
    return linesData
      .map((line) => {
        const state = getLineState(line);
        const priority = calculateLinePriority(state);
        return { line, state, priority } as const;
      })
      .sort((a, b) => a.priority - b.priority)
      .map(({ line, state }) => ({ line, state }));
  }, [linesData, getLineState]);

  return { sortedLines };
};
