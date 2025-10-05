import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Achievement, AchievementsState, RawAchievement } from "@/types";
import { normalizeAchievementTree } from "@/utils";

export const fetchAchievements = createAsyncThunk(
  "achievements/fetch",
  async (url: string, { rejectWithValue }) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return rejectWithValue({
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
        });
      }

      const data = (await response.json()) as RawAchievement;
      const { achievements, rootId } = normalizeAchievementTree(data);

      return { achievements, rootId };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return rejectWithValue({
            message: "Request timeout - Please check your connection",
            status: 408,
          });
        }
        return rejectWithValue({
          message: error.message,
          status: 0,
        });
      }
      return rejectWithValue({
        message: "Error desconocido al cargar los datos",
        status: 0,
      });
    }
  },
);

const initialState: AchievementsState = {
  achievements: {},
  rootId: null,
  isLoading: false,
  error: null,
};

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    toggleAchievement: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const node = state.achievements[id];
      if (!node || node.isLocked) return;

      if (node.parentId) {
        const parent = state.achievements[node.parentId];
        if (!parent?.isCompleted) return;
      }

      // Toggle completion state of the target node.
      const shouldComplete = !node.isCompleted;
      node.isCompleted = shouldComplete;

      /**
       * Depth-first traversal applying a function to all descendants.
       * Assumes a tree (no defensive cycle detection here by design for performance).
       */
      const visitChildren = (
        ancestorId: string,
        fn: (ach: Achievement) => void,
      ) => {
        const ancestor = state.achievements[ancestorId];
        ancestor?.childrenIds.forEach((childId) => {
          const child = state.achievements[childId];
          if (!child) return;
          fn(child);
          visitChildren(childId, fn);
        });
      };

      // If unmarking: recursively clear completion for all descendants.
      if (!shouldComplete) {
        visitChildren(id, (ach) => {
          ach.isCompleted = false;
        });
      }

      // Recompute locked state for the subtree: a node is locked if its parent is not completed.
      visitChildren(id, (ach) => {
        if (ach.parentId) {
          const parent = state.achievements[ach.parentId];
          ach.isLocked = !parent?.isCompleted;
        }
      });

      // Direct children lock / unlock based on the new state of the toggled node.
      node.childrenIds.forEach((childId) => {
        const child = state.achievements[childId];
        if (child) child.isLocked = !node.isCompleted;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload.achievements;
        state.rootId = action.payload.rootId;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = (action.payload as { message: string }).message;
        } else {
          state.error = action.error.message ?? "Error desconocido";
        }
      });
  },
});

export const AchievementsActions = {
  toggleAchievement: achievementsSlice.actions.toggleAchievement,
  fetchAchievements,
};

export default achievementsSlice.reducer;
