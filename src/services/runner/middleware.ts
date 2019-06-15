import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { reset, step } from "./actions";
import { getCurrentAction } from "./selectors";
import { TutorialState } from "../../types";
import { getRunner } from "../../selectors";

const stepType = step().type;

export const executeActions: Middleware<{}, TutorialState> = (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  if (action.type === stepType) {
    const stepAction = getCurrentAction(getRunner(store.getState()));

    if (stepAction) {
      store.dispatch(stepAction);
    }
  }

  return next(action);
};

export const resetOnScriptChange: Middleware<{}, TutorialState> = (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const origScript = getRunner(store.getState()).script;

  const result = next(action);

  if (getRunner(store.getState()).script !== origScript) {
    store.dispatch(reset());
  }

  return result;
};
