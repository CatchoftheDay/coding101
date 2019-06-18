import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { reset, step, stop, setRunHandle } from "./actions";
import { getCurrentAction } from "./selectors";
import { TutorialState } from "../../types";
import { RunnerState } from "./types";

const stepType = step().type;

export const executeActions = (
  selector: (state: any) => RunnerState = (state: RunnerState) => state
): Middleware<{}, TutorialState> => (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  if (action.type === stepType) {
    const stepAction = getCurrentAction(selector(store.getState()));

    if (stepAction) {
      store.dispatch(stepAction);
    }
  }

  return next(action);
};

export const resetOnScriptChange = (
  selector: (state: any) => RunnerState
): Middleware<{}, TutorialState> => (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const origScript = selector(store.getState()).script;

  const result = next(action);

  if (selector(store.getState()).script !== origScript) {
    store.dispatch(reset());
  }

  return result;
};

export const run = (
  selector: (state: any) => RunnerState
): Middleware<{}, TutorialState> => (
  store: MiddlewareAPI<Dispatch, TutorialState>
) => (next: Dispatch) => (action: AnyAction) => {
  const result = next(action);
  const { error, currStepId, running, runHandle } = selector(store.getState());

  if (running && (error !== undefined || currStepId === undefined)) {
    store.dispatch(stop());
  } else if (running && !runHandle) {
    store.dispatch(
      setRunHandle(window.setInterval(() => store.dispatch(step()), 50))
    );
  } else if (runHandle !== undefined && !running) {
    window.clearTimeout(runHandle);
    store.dispatch(setRunHandle(undefined));
  }

  return result;
};
