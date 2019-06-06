import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { step } from "./actions";
import { getCurrentAction } from "./selectors";
import { RunnerState } from "./types";

const stepType = step().type;

const middleware: Middleware<{}, RunnerState> = (
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

export default middleware;
