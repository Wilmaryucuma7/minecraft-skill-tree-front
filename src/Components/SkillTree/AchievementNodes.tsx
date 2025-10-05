import { memo, useMemo } from "react";
import AchievementNode from "./AchievementNode";
import type { Achievement, LayoutNode } from "@/types";
import styles from "./SkillTree.module.css";

interface AchievementNodesProps {
  treeLayout: LayoutNode[];
  achievements: Record<string, Achievement>;
  onNodeClick: (id: string) => void;
  onHoverChange: (id: string | null) => void;
}

function AchievementNodes({
  treeLayout,
  achievements,
  onNodeClick,
  onHoverChange,
}: AchievementNodesProps) {
  const nodes = useMemo(
    () =>
      treeLayout.map((node) => {
        const achievement = achievements[node.id];
        if (!achievement) return null;

        return (
          <div
            key={node.id}
            className={styles.nodePosition}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }}
          >
            <AchievementNode
              achievement={achievement}
              onClick={onNodeClick}
              onHoverChange={onHoverChange}
            />
          </div>
        );
      }),
    [treeLayout, achievements, onNodeClick, onHoverChange],
  );

  return <div className={styles.nodesContainer}>{nodes}</div>;
}

export default memo(AchievementNodes);
