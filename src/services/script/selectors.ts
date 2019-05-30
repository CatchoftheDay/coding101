import { Script, Step } from "./types";
import { flattenSteps } from "./reducers";

/** Returns the ID of the first step */
export const getFirstStepId = (steps: Script) => steps[0] && steps[0].id;

/**
 * Recursively searches the step tree and returns the step with the given ID,
 * if it exists
 */
export const getStep = (steps: ReadonlyArray<Step>, id: number) =>
  flattenSteps(steps).find(step => step.id === id);

/** Returns the parent of the given step, if any */
export const getParentStep = (script: Script, from: Step) => {
  const allSteps = flattenSteps(script);

  return allSteps.find(
    step => !!getChildren(step).find(step => step.id === from.id)
  );
};

/** Returns the siblings of the given step */
export const getSiblings = (script: Script, step: Step) => {
  if (script.find(current => current === step)) {
    return script;
  } else {
    return getChildren(getParentStep(script, step)!);
  }
};

/** Returns the next sibling of the given step */
export const getNextSibling = (script: Script, step: Step) => {
  const siblings = getSiblings(script, step);

  if (siblings.length) {
    return siblings[siblings.findIndex(current => current === step) + 1];
  } else {
    return undefined;
  }
};

/** Returns the children of the step */
export const getChildren = (step: Step): ReadonlyArray<Step> => {
  switch (step.type) {
    case "branch":
      return step.conditions;
    case "conditional":
    case "while":
      return step.steps;
    default:
      return [];
  }
};
