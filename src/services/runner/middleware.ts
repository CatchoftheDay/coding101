import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { reset, step } from "./actions";
import { getCurrentAction } from "./selectors";
import { RunnerState } from "./types";

const stepType = step().type;

export const executeActions: Middleware<{}, RunnerState> = (
  store: MiddlewareAPI<Dispatch, RunnerState>
) => (next: Dispatch) => (action: AnyAction) => {
  if (action.type === stepType) {
    const stepAction = getCurrentAction(store.getState());

    if (stepAction) {
      store.dispatch(stepAction);
    }
  }

  return next(action);
};

export const resetOnScriptChange: Middleware<{}, RunnerState> = (
  store: MiddlewareAPI<Dispatch, RunnerState>
) => (next: Dispatch) => (action: AnyAction) => {
  const origScript = store.getState().script;

  const result = next(action);

  if (store.getState().script !== origScript) {
    store.dispatch(reset());
  }

  return result;
};
