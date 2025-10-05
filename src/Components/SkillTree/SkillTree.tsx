import { useCallback, useMemo } from "react";
import { useAppDispatch } from "@/store";
import { AchievementsActions } from "@/features/achievements/achievements.slice";
import {
  useSkillTreeData,
  useAchievementsData,
  useTreeLayout,
  useConnectionLines,
  useTreeInteraction,
} from "@/hooks";
import { SKILL_TREE_URL } from "@/config";
import ConnectionLines from "./ConnectionLines";
import AchievementNodes from "./AchievementNodes";
import { LoadingState, ErrorState, EmptyState } from "./TreeStates";
import type { LineState } from "@/types";
import styles from "./SkillTree.module.css";

function SkillTree() {
  const dispatch = useAppDispatch();

  const { achievements, rootId, isLoading, error } = useAchievementsData();

  const { hoveredNodeId, handleHoverChange } = useTreeInteraction();

  useSkillTreeData(SKILL_TREE_URL);

  const handleAchievementClick = useCallback(
    (id: string) => {
      dispatch(AchievementsActions.toggleAchievement(id));
    },
    [dispatch],
  );

  const { treeLayout, treeDimensions } = useTreeLayout(achievements, rootId);

  const { sortedLines } = useConnectionLines(
    treeLayout,
    achievements,
    hoveredNodeId,
  );

  const lineClassMap: Record<LineState, string> = useMemo(
    () => ({
      completed: `${styles.connectionLine} ${styles.connectionLineCompleted}`,
      hoverYellow: `${styles.connectionLine} ${styles.connectionLineHoverYellow}`,
      available: `${styles.connectionLine} ${styles.connectionLineAvailable}`,
      white: `${styles.connectionLine} ${styles.connectionLineWhite}`,
      default: styles.connectionLine,
    }),
    [],
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!treeLayout || treeLayout.length === 0) return <EmptyState />;

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer} data-scroll-container>
        <div
          className={styles.treeWrapper}
          style={{
            width: `${treeDimensions.width}px`,
            height: `${treeDimensions.height}px`,
          }}
        >
          <ConnectionLines
            sortedLines={sortedLines}
            treeDimensions={treeDimensions}
            lineClassMap={lineClassMap}
          />

          <AchievementNodes
            treeLayout={treeLayout}
            achievements={achievements}
            onNodeClick={handleAchievementClick}
            onHoverChange={handleHoverChange}
          />
        </div>
      </div>
    </div>
  );
}

export default SkillTree;
