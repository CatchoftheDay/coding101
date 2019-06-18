import { TutorialState } from "./types";

export const getRunner = (state: TutorialState) => state.runner;
export const getStage = (state: TutorialState) => state.stage;
export const getKeystrokes = (state: TutorialState) => state.keystrokes;
export const getAchievements = (state: TutorialState) => state.achievements;
export const hasAchievement = (state: TutorialState, achievement: string) =>
  getAchievements(state).indexOf(achievement) !== -1;
