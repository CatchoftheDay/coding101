import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Stage, TutorialState } from "./types";
import { getKeystrokes } from "./selectors";
import { addKeyType, advanceTo } from "./actions";

export const checkCodes: Middleware<{}, TutorialState> = (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const result = next(action);

  if (action.type === addKeyType) {
    const keystrokes = getKeystrokes(store.getState());
    if (/catch$/i.test(keystrokes)) {
      store.dispatch(advanceTo(Stage.CONTROL));
    }
  }

  return result;
};
