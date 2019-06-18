import { TutorialState } from "./types";
import {
  doorOpen,
  getMovements,
  getScript,
  hasKey,
  hasKeySet,
  isAtFinish,
  isDone
} from "./services/runner/selectors";
import { getRunner } from "./selectors";
import { flattenSteps } from "./services/script/reducers";

const achievements: {
  id: string;
  text: string;
  check: (state: TutorialState) => boolean;
}[] = [
  {
    id: "firstStep",
    text: "Adding your first step",
    check: state => !!getScript(state.runner) //true //getScript(getRunner(state)).length > 1
  },
  {
    id: "threeSteps",
    text: "Move three squares without crashing",
    check: state => getMovements(getRunner(state)) >= 3
  },
  {
    id: "reachedFinish",
    text: "Reaching the finish",
    check: state => isAtFinish(getRunner(state))
  },
  {
    id: "firstProgram",
    text: "A fully working program",
    check: state => {
      const runnerState = getRunner(state);
      if (isAtFinish(runnerState) && isDone(runnerState)) {
        const steps = flattenSteps(getScript(runnerState));

        return (
          steps.some(step => step.type === "branch") &&
          steps.some(step => step.type === "while")
        );
      } else {
        return false;
      }
    }
  },
  {
    id: "gotTheKey",
    text: "Grabbing the key",
    check: state => hasKey(getRunner(state))
  },
  {
    id: "rememberTheKey",
    text: "Remembering the key",
    check: state => hasKey(getRunner(state)) && hasKeySet(getRunner(state))
  },
  {
    id: "openedTheDoor",
    text: "Opening the door",
    check: state => doorOpen(getRunner(state))
  },
  {
    id: "allDone",
    text: "Completing Catch Coding 101",
    check: state => {
      const runnerState = getRunner(state);

      return (
        doorOpen(runnerState) && isAtFinish(runnerState) && isDone(runnerState)
      );
    }
  }
];

export default achievements;
