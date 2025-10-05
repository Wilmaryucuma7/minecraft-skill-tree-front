export interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId: string | null;
  childrenIds: string[];
  isCompleted: boolean;
  isLocked: boolean;
}

export interface RawAchievement {
  name: string;
  description: string;
  image: string;
  children: RawAchievement[];
}

export interface AchievementsState {
  achievements: Record<string, Achievement>;
  rootId: string | null;
  isLoading: boolean;
  error: string | null;
}
