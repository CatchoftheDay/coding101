import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Stage, TutorialState } from "./types";
import { getKeystrokes, hasAchievement } from "./selectors";
import { addAchievement, addKeyType, advanceTo } from "./actions";
import achievements from "./achievements";

export const checkCodes: Middleware<{}, TutorialState> = (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const result = next(action);

  if (action.type === addKeyType) {
    const keystrokes = getKeystrokes(store.getState());
    if (/catch$/i.test(keystrokes)) {
      store.dispatch(advanceTo(Stage.CONTROL));
    } else if (/coding101$/i.test(keystrokes)) {
      store.dispatch(advanceTo(Stage.VARIABLES));
    }
  }

  return result;
};

export const checkAchievements: Middleware<{}, TutorialState> = (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const result = next(action);
  const state = store.getState();
  achievements
    .filter(
      achievement =>
        !hasAchievement(state, achievement.id) && achievement.check(state)
    )
    .forEach(({ id }) => store.dispatch(addAchievement(id)));

  return result;
};

export const saveState: Middleware<{}, TutorialState> = (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const result = next(action);

  try {
    const state = JSON.parse(JSON.stringify(store.getState()));

    state.runner.running = false;
    delete state.runner.runHandle;
    delete state.runner.maze;
    delete state.keystrokes;

    localStorage.state = JSON.stringify(state);
  } catch (e) {
    // Doesn't matter if we can't save
  }

  return result;
};
