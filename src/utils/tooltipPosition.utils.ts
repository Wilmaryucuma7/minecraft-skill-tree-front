import { TOOLTIP_OFFSET, BOUNDARY_PADDING } from "@/constants";

export type TooltipPlacement = "top" | "bottom";

interface TooltipPosition {
  top: number;
  left: number;
}

interface CalculateTooltipPositionParams {
  nodeRect: DOMRect;
  tooltipRect: DOMRect;
  containerRect: DOMRect;
}

export const calculateTooltipPosition = ({
  nodeRect,
  tooltipRect,
  containerRect,
}: CalculateTooltipPositionParams): {
  position: TooltipPosition;
  placement: TooltipPlacement;
} => {
  const minTop = containerRect.top + BOUNDARY_PADDING;
  const maxTop = containerRect.bottom - BOUNDARY_PADDING - tooltipRect.height;

  let top = nodeRect.bottom + TOOLTIP_OFFSET;
  let placement: TooltipPlacement = "bottom";

  if (top > maxTop) {
    top = nodeRect.top - tooltipRect.height - TOOLTIP_OFFSET;
    placement = "top";
  }

  if (top < minTop) {
    if (maxTop >= minTop) {
      top = Math.min(nodeRect.bottom + TOOLTIP_OFFSET, maxTop);
    } else {
      top = minTop;
    }
    placement = "bottom";
  }

  if (maxTop >= minTop) {
    top = Math.max(Math.min(top, maxTop), minTop);
  }

  const minLeft = containerRect.left + BOUNDARY_PADDING;
  const maxLeft = containerRect.right - BOUNDARY_PADDING - tooltipRect.width;

  let left = nodeRect.left + nodeRect.width / 2 - tooltipRect.width / 2;

  if (maxLeft < minLeft) {
    left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
  } else {
    left = Math.max(Math.min(left, maxLeft), minLeft);
  }

  return {
    position: { top, left },
    placement,
  };
};

export const shouldUpdateTooltipPosition = (
  prev: TooltipPosition,
  next: TooltipPosition,
  threshold = 0.5,
): boolean => {
  return (
    Math.abs(prev.top - next.top) >= threshold ||
    Math.abs(prev.left - next.left) >= threshold
  );
};
