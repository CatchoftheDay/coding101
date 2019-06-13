import { createReducer } from "deox";
import {
  ActionStep,
  BranchStep,
  ConditionalStep,
  Script,
  Step,
  WhileStep
} from "./types";
import { deleteStep, insertStep, setAction, setCondition } from "./actions";
import produce from "immer";
import { getStep, getChildren, getParentStep, getSiblings } from "./selectors";

export const initialState: Script = [];

/**
 * Flattens the step and its children into a single array
 *
 * @param step The step to flatten
 */
const flattenStep = (step: Step): ReadonlyArray<Step> =>
  [step].concat(flattenSteps(getChildren(step)));

/**
 * Flattens the given steps and their children into a single array
 *
 * @param steps The steps to flatten
 */
export const flattenSteps = (steps: ReadonlyArray<Step>) => {
  return steps.reduce((acc: Step[], step) => acc.concat(flattenStep(step)), []);
};

export default createReducer(initialState, handle => [
  handle(insertStep, (script, { payload }) => {
    const { beforeId, parentId } = payload;
    let { step } = payload;

    script = produce(inPlaceDeleteById)(script, step.id);

    if (step.type === "branch") {
      step = {
        ...step,
        conditions: ensureBranchHasElseCondition(step.conditions)
      } as BranchStep;
    }

    return produce(draftSteps => {
      const parent = parentId && getStep(draftSteps, parentId);
      const siblings: Step[] = parent ? getChildren(parent) : draftSteps;
      const insertIdx = beforeId
        ? siblings.findIndex(child => child.id === beforeId)
        : siblings.length;

      siblings.splice(insertIdx, 0, step);

      if (parent && parent.type === "branch") {
        parent.conditions = ensureBranchHasElseCondition(
          parent.conditions
        ) as ConditionalStep[];
      }
    })(script);
  }),
  handle(
    deleteStep,
    produce((draftSteps, { payload: deleteId }) => {
      const step = getStep(draftSteps, deleteId);
      const parent = step && getParentStep(draftSteps, step);

      inPlaceDeleteById(draftSteps, deleteId);

      if (parent && parent.type === "branch") {
        if (parent.conditions.length === 0) {
          // All the conditions have been removedl delete hte branch
          const parentSiblings = getSiblings(draftSteps, parent) as Step[];
          parentSiblings.splice(parentSiblings.indexOf(parent), 1);
        } else {
          parent.conditions = ensureBranchHasElseCondition(
            parent.conditions
          ) as ConditionalStep[];
        }
      }
    })
  ),
  handle(
    setAction,
    produce((draftSteps, { payload: { id, action } }) => {
      const step = <ActionStep>getStep(draftSteps, id);
      step.action = action;
    })
  ),
  handle(
    setCondition,
    produce((draftSteps, { payload: { id, condition } }) => {
      const step = <ConditionalStep | WhileStep>getStep(draftSteps, id);
      const parent = getParentStep(draftSteps, step);

      step.condition = condition;

      if (parent && parent.type === "branch") {
        parent.conditions = ensureBranchHasElseCondition(
          parent.conditions
        ) as ConditionalStep[];
      }
    })
  )
]);

/**
 * Does an in-place deletion of the step with the given ID, ie it makes
 * direct modification to draftSteps
 */
const inPlaceDeleteById = (draftSteps: Script, deleteId: number) => {
  const allSteps = flattenSteps(draftSteps);
  const parent = allSteps.find(
    step => !!getChildren(step).find(step => step.id === deleteId)
  );
  const children = parent ? getChildren(parent) : <Step[]>draftSteps;
  const deleteIdx = children.findIndex(step => step.id === deleteId);

  if (deleteIdx !== -1) {
    (children as Step[]).splice(deleteIdx, 1);
  }
};

/**
 * Normalises a branch step so that there are no blank conditions except for
 * one on the end
 */
const ensureBranchHasElseCondition = (
  conditions: ReadonlyArray<ConditionalStep>
) => {
  if (
    !conditions.length ||
    conditions[conditions.length - 1].condition != null
  ) {
    // Always have an "else" clause on the end
    conditions = conditions.concat([
      { id: Math.random(), type: "conditional", condition: null, steps: [] }
    ]);
  }

  return conditions;
};
