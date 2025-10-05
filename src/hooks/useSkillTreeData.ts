import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { fetchAchievements } from "@/features/achievements/achievements.slice";

export const useSkillTreeData = (url: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchAchievements(url));
  }, [url, dispatch]);
};
