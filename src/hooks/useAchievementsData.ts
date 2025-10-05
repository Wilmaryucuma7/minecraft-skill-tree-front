import { useAppSelector } from "@/store";
import {
  selectAchievements,
  selectRootId,
  selectIsLoading,
  selectError,
} from "@/features/achievements/achievements.selectors";

export const useAchievementsData = () => {
  const achievements = useAppSelector(selectAchievements);
  const rootId = useAppSelector(selectRootId);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    achievements,
    rootId,
    isLoading,
    error,
  };
};
