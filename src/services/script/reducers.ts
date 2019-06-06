import { createReducer } from "deox";
import { ActionStep, ConditionalStep, Script, Step, WhileStep } from "./types";
import { deleteStep, insertStep, setAction, setCondition } from "./actions";
import produce from "immer";
import { getStep, getChildren } from "./selectors";

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

    if (step.id !== null) {
      script = deleteById(script, step.id);
    } else {
      step = { ...step, id: Math.random() };
    }

    return produce(draftSteps => {
      const children: Step[] = parentId
        ? getChildren(getStep(draftSteps, parentId)!)
        : draftSteps;
      const insertIdx = beforeId
        ? children.findIndex(child => child.id === beforeId)
        : children.length;

      children.splice(insertIdx, 0, step);
    })(script);
  }),
  handle(deleteStep, (script, { payload: deleteId }) =>
    deleteById(script, deleteId)
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
      step.condition = condition;
    })
  )
]);

const deleteById = produce((draftSteps: Script, deleteId: number) => {
  const allSteps = flattenSteps(draftSteps);
  const parent = allSteps.find(
    step => !!getChildren(step).find(step => step.id === deleteId)
  );
  const children = parent ? getChildren(parent) : <Step[]>draftSteps;
  const deleteIdx = children.findIndex(step => step.id === deleteId);

  if (deleteIdx !== -1) {
    (children as Step[]).splice(deleteIdx, 1);
  }
});
