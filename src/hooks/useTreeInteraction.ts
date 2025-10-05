import { useState, useCallback } from "react";

export const useTreeInteraction = () => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleHoverChange = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);

  return {
    hoveredNodeId,
    handleHoverChange,
  };
};
