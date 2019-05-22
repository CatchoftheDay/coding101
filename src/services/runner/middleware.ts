import { Action, AnyAction, Dispatch, Store } from "redux";
import { step } from "./actions";
import { getCurrentAction } from "./selectors";
import { RunnerState } from "./types";

const stepType = step().type;

export default <A extends Action = AnyAction>(store: Store<RunnerState>) => (
  next: Dispatch<A>
) => (action: A) => {
  if (action.type === stepType) {
    const stepAction = getCurrentAction(store.getState());

    if (stepAction) {
      store.dispatch(stepAction);
    }
  }

  return next(action);
};
