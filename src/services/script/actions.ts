import { createAction } from "deox";
import { Condition, Step } from "./types";

export const insertStep = createAction(
  "script/insertStep",
  resolve => (
    step: Step,
    parentId: number | undefined,
    beforeId: number | undefined
  ) =>
    resolve({
      step,
      beforeId,
      parentId
    })
);

export const deleteStep = createAction(
  "script/deleteStep",
  resolve => (id: number) => resolve(id)
);

export const setAction = createAction(
  "script/setAction",
  resolve => (id: number, action: string | null) => resolve({ id, action })
);

export const insertCondition = createAction(
  "script/insertCondition",
  resolve => (id: number, condition: Condition, beforeId?: number) =>
    resolve({ id, condition, beforeId })
);

export const deleteCondition = createAction(
  "script/deleteCondition",
  resolve => (id: number) => resolve(id)
);

export const negateCondition = createAction(
  "script/negateCondition",
  resolve => (id: number, conditionId) => resolve({ id, conditionId })
);
