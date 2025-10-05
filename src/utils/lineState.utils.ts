import type { Achievement, LineGeometry, LineState } from "@/types";

export const determineLineState = (
  line: LineGeometry,
  achievements: Record<string, Achievement>,
  hoveredNodeId: string | null,
): LineState => {
  const childNode = achievements[line.id];
  const parentNode = line.parentId ? achievements[line.parentId] : null;
  const isHover = hoveredNodeId === line.id;
  const isChildCompleted = Boolean(childNode?.isCompleted);
  const isParentCompleted = Boolean(parentNode?.isCompleted);
  const isChildUnlocked = childNode ? !childNode.isLocked : false;

  if (isChildCompleted) {
    return "completed";
  }

  if (isHover && isChildUnlocked && isParentCompleted) {
    return "hoverYellow";
  }

  if (isHover && isParentCompleted) {
    return "available";
  }

  if (isParentCompleted && isChildUnlocked) {
    return "white";
  }

  return "default";
};

export const calculateLinePriority = (state: LineState): number => {
  if (state === "completed" || state === "hoverYellow") {
    return 2;
  }
  if (state === "available") {
    return 1;
  }
  return 0;
};
