import type { LayoutNode, LineGeometry } from "@/types";
import { NODE_TOTAL_SIZE, NODE_CENTER_OFFSET } from "@/constants";

export const calculateLinesGeometry = (
  treeLayout: LayoutNode[] | null,
): LineGeometry[] => {
  if (!treeLayout) return [];

  const layoutById = new Map(treeLayout.map((node) => [node.id, node]));

  return treeLayout
    .filter((node) => node.parentId)
    .map((node): LineGeometry | null => {
      const parent = node.parentId ? layoutById.get(node.parentId) : null;
      if (!parent) return null;

      const startX = parent.x + NODE_TOTAL_SIZE;
      const startY = parent.y + NODE_CENTER_OFFSET;
      const endX = node.x;
      const endY = node.y + NODE_CENTER_OFFSET;
      const midX = startX + (endX - startX) / 2;

      return {
        id: node.id,
        parentId: node.parentId,
        startX,
        startY,
        midX,
        endX,
        endY,
      };
    })
    .filter((line): line is LineGeometry => line !== null);
};
