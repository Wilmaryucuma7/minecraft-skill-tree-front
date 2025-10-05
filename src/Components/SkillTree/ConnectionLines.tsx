import { memo } from "react";
import { generateSvgPath } from "@/utils";
import type { LineState, TreeDimensions, LineWithState } from "@/types";
import styles from "./SkillTree.module.css";

interface ConnectionLinesProps {
  sortedLines: LineWithState[];
  treeDimensions: TreeDimensions;
  lineClassMap: Record<LineState, string>;
}

function ConnectionLines({
  sortedLines,
  treeDimensions,
  lineClassMap,
}: ConnectionLinesProps) {
  return (
    <svg
      className={styles.svg}
      style={{
        width: `${treeDimensions.width}px`,
        height: `${treeDimensions.height}px`,
      }}
    >
      {sortedLines.map(({ line, state }) => {
        const pathData = generateSvgPath(line);
        const className = lineClassMap[state] ?? styles.connectionLine;

        return (
          <path key={`line-${line.id}`} d={pathData} className={className} />
        );
      })}
    </svg>
  );
}

export default memo(ConnectionLines);
