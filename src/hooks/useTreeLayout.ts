import { useMemo } from "react";
import { calculateTreeLayout, calculateTreeDimensions } from "@/utils";
import type { Achievement, LayoutNode, TreeDimensions } from "@/types";

interface UseTreeLayoutResult {
  treeLayout: LayoutNode[] | null;
  treeDimensions: TreeDimensions;
}

export const useTreeLayout = (
  achievements: Record<string, Achievement>,
  rootId: string | null,
): UseTreeLayoutResult => {
  const treeLayout = useMemo(
    () => calculateTreeLayout(achievements, rootId),
    [achievements, rootId],
  );

  const treeDimensions = useMemo(
    () => calculateTreeDimensions(treeLayout),
    [treeLayout],
  );

  return { treeLayout, treeDimensions };
};
