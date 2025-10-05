export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  parentId: string | null;
}

export interface LineGeometry {
  id: string;
  parentId: string | null;
  startX: number;
  startY: number;
  midX: number;
  endX: number;
  endY: number;
}

export interface TreeBounds {
  minY: number;
  maxY: number;
}

export interface TreeDimensions {
  width: number;
  height: number;
}

export type LineState =
  | "completed"
  | "hoverYellow"
  | "available"
  | "white"
  | "default";

// Derived line with visual state, used by rendering layer.
export interface LineWithState {
  line: LineGeometry;
  state: LineState;
}
