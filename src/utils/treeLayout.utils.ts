import type {
  Achievement,
  LayoutNode,
  TreeBounds,
  TreeDimensions,
} from "@/types";
import {
  NODE_TOTAL_SIZE,
  NODE_CENTER_OFFSET,
  HORIZONTAL_SPACING,
  VERTICAL_SPACING,
  INITIAL_X,
  INITIAL_Y,
} from "@/constants";

interface LayoutPosition {
  x: number;
  y: number;
  parentId: string | null;
}

/**
 * Produces an absolute (x,y) layout for the achievement tree.
 * Strategy:
 *  - Depth-first traversal: leaves are assigned sequential vertical slots (startY cursor).
 *  - Parent nodes are vertically centered between the min / max span of their children.
 *  - Horizontal position = depth * HORIZONTAL_SPACING + INITIAL_X.
 * Invariants:
 *  - Each node appears exactly once (assumes a strict tree, no cycles).
 *  - Returned coordinates reference the top-left of the node box.
 * Complexity: O(N) time / O(N) space where N = number of achievements.
 */
export const calculateTreeLayout = (
  achievements: Record<string, Achievement>,
  rootId: string | null,
): LayoutNode[] | null => {
  if (!rootId || !achievements[rootId]) return null;

  const layoutMap = new Map<string, LayoutPosition>();

  /**
   * Recursively assigns positions.
   * @param id        Current node id.
   * @param depth     Depth level from root (root = 0).
   * @param parentId  Parent id (null for root).
   * @param startY    The current vertical cursor for the subtree.
   * @returns The vertical bounds (minY, maxY) occupied by this subtree.
   */
  const assignPositions = (
    id: string,
    depth: number,
    parentId: string | null,
    startY: number,
  ): TreeBounds => {
    const achievement = achievements[id];
    if (!achievement) {
      return { minY: startY, maxY: startY + NODE_TOTAL_SIZE };
    }

    const x = depth * HORIZONTAL_SPACING + INITIAL_X;
    const children = achievement.childrenIds;

    // Leaf: directly place at current startY and consume one node slot.
    if (children.length === 0) {
      const y = startY;
      layoutMap.set(id, { x, y, parentId });
      return { minY: y, maxY: y + NODE_TOTAL_SIZE };
    }

    const childBounds: TreeBounds[] = [];
    let currentChildY = startY;

    children.forEach((childId, index) => {
      const bounds = assignPositions(childId, depth + 1, id, currentChildY);
      childBounds.push(bounds);

      if (index < children.length - 1) {
        currentChildY = bounds.maxY + VERTICAL_SPACING;
      }
    });

    const subtreeMinY = Math.min(...childBounds.map((b) => b.minY));
    const subtreeMaxY = Math.max(...childBounds.map((b) => b.maxY));
    // Center parent vertically between first and last child span.
    const parentY = (subtreeMinY + subtreeMaxY) / 2 - NODE_CENTER_OFFSET;
    layoutMap.set(id, { x, y: parentY, parentId });

    return { minY: subtreeMinY, maxY: subtreeMaxY };
  };

  assignPositions(rootId, 0, null, INITIAL_Y);

  return Array.from(layoutMap.entries()).map(([id, pos]) => ({
    id,
    x: pos.x,
    y: pos.y,
    parentId: pos.parentId,
  }));
};

export const calculateTreeDimensions = (
  treeLayout: LayoutNode[] | null,
): TreeDimensions => {
  if (!treeLayout || treeLayout.length === 0) {
    return { width: 0, height: 0 };
  }

  const maxX = Math.max(...treeLayout.map((node) => node.x)) + NODE_TOTAL_SIZE;
  const maxY = Math.max(...treeLayout.map((node) => node.y)) + NODE_TOTAL_SIZE;

  return {
    width: maxX,
    height: maxY,
  };
};
