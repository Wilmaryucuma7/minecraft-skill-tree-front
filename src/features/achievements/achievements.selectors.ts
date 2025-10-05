import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export const selectAchievementsState = (state: RootState) => state.achievements;

export const selectAchievements = createSelector(
  selectAchievementsState,
  (slice) => slice.achievements,
);

export const selectRootId = createSelector(
  selectAchievementsState,
  (slice) => slice.rootId,
);

export const selectIsLoading = createSelector(
  selectAchievementsState,
  (slice) => slice.isLoading,
);

export const selectError = createSelector(
  selectAchievementsState,
  (slice) => slice.error,
);
