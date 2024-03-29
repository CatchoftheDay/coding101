import { Condition, ConditionalStep, Script, Step } from "./types";
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

/** Gets the parent step of a condition */
export const getConditionParentStep = (script: Script, from: Condition) =>
  flattenSteps(script).find(
    step =>
      step.type === "conditional" &&
      step.conditions.some(({ id }) => id === from.id)
  ) as ConditionalStep | undefined;

/** Returns the siblings of the given step */
export const getSiblings = (script: Script, step: Step) => {
  if (script.find(current => current === step)) {
    return script;
  } else {
    const parent = getParentStep(script, step);

    if (parent) {
      return getChildren(parent);
    } else {
      return [];
    }
  }
};

/** Returns the index of the step amongst its siblings */
export const getSiblingIndex = (script: Script, step: Step) => {
  return getSiblings(script, step).findIndex(current => current == step);
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

/** Returns true if potentialAncestor is an ancestor of step */
export const isAncestor = (step: Step, potentialAncestor: Step) =>
  flattenSteps([potentialAncestor]).includes(step);
