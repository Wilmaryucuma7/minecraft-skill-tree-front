import type { LineGeometry } from "@/types";

export const generateSvgPath = (line: LineGeometry): string => {
  return `M ${line.startX} ${line.startY} L ${line.midX} ${line.startY} L ${line.midX} ${line.endY} L ${line.endX} ${line.endY}`;
};
