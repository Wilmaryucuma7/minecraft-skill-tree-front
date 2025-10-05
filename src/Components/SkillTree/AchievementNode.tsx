import { useState, memo, useRef, useLayoutEffect } from "react";
import type { Achievement } from "@/types";
import {
  calculateTooltipPosition,
  shouldUpdateTooltipPosition,
  type TooltipPlacement,
} from "@/utils";
import styles from "./AchievementNode.module.css";

interface AchievementNodeProps {
  achievement: Achievement;
  onClick: (id: string) => void;
  onHoverChange: (id: string | null) => void;
}

function AchievementNode({
  achievement,
  onClick,
  onHoverChange,
}: AchievementNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [tooltipPlacement, setTooltipPlacement] =
    useState<TooltipPlacement>("bottom");
  const nodeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!showTooltip || !nodeRef.current || !tooltipRef.current) {
      return;
    }

    const nodeEl = nodeRef.current;
    const borderContainer = nodeEl.closest("[data-border-container]");
    const scrollContainer = nodeEl.closest("[data-scroll-container]");

    const getContainerRect = () =>
      borderContainer?.getBoundingClientRect() ??
      document.body.getBoundingClientRect();

    const updatePosition = () => {
      if (!nodeRef.current || !tooltipRef.current) return;

      const nodeRect = nodeRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = getContainerRect();

      const { position, placement } = calculateTooltipPosition({
        nodeRect,
        tooltipRect,
        containerRect,
      });

      setTooltipPlacement((prev) => (prev === placement ? prev : placement));
      setTooltipPos((prev) => {
        if (shouldUpdateTooltipPosition(prev, position)) {
          return position;
        }
        return prev;
      });
    };

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const scrollListenerOptions: AddEventListenerOptions = { passive: true };
    scrollContainer?.addEventListener(
      "scroll",
      handleScrollOrResize,
      scrollListenerOptions,
    );
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      scrollContainer?.removeEventListener(
        "scroll",
        handleScrollOrResize,
        scrollListenerOptions,
      );
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [showTooltip, achievement.id]);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onHoverChange(achievement.id);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onHoverChange(null);
  };

  const handleClick = () => {
    if (!achievement.isLocked) {
      onClick(achievement.id);
    }
  };

  const getNodeClass = () => {
    if (achievement.isCompleted) {
      return styles.completed;
    }
    if (achievement.isLocked) {
      return styles.locked;
    }
    return styles.unlocked;
  };

  return (
    <div
      ref={nodeRef}
      className={styles.nodeWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.verticalBorder}>
        <div className={styles.horizontalBorder}>
          <button
            className={`${styles.node} ${getNodeClass()}`}
            onClick={handleClick}
            disabled={achievement.isLocked}
            aria-label={achievement.name}
          >
            <img
              src={achievement.image}
              alt={achievement.name}
              className={styles.image}
              draggable={false}
            />
          </button>
        </div>
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${styles[`tooltip${tooltipPlacement.charAt(0).toUpperCase() + tooltipPlacement.slice(1)}`]} ${achievement.isLocked ? styles.tooltipLockedStyle : ""}`}
          style={{
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
          }}
        >
          <div className={styles.tooltipTitle}>{achievement.name}</div>
          <div className={styles.tooltipDescription}>
            {achievement.description}
          </div>
          {achievement.isLocked && (
            <div className={styles.tooltipLockedText}>🔒 Bloqueado</div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(AchievementNode);
