import type { RawAchievement, Achievement } from "@/types";

interface NormalizedData {
  achievements: Record<string, Achievement>;
  rootId: string;
}

export const normalizeAchievementTree = (
  rawData: RawAchievement,
): NormalizedData => {
  const achievements: Record<string, Achievement> = {};
  let idCounter = 0;

  const normalizeNode = (
    node: RawAchievement,
    parentId: string | null,
  ): string => {
    const id = `achievement-${idCounter++}`;

    const achievement: Achievement = {
      id,
      name: node.name,
      description: node.description,
      image: node.image,
      parentId,
      childrenIds: [],
      isCompleted: false,
      isLocked: parentId !== null,
    };

    achievements[id] = achievement;

    if (node.children?.length > 0) {
      node.children.forEach((child) => {
        const childId = normalizeNode(child, id);
        achievement.childrenIds.push(childId);
      });
    }

    return id;
  };

  const rootId = normalizeNode(rawData, null);

  return { achievements, rootId };
};
