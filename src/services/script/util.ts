import {
  ActionStep,
  BranchStep,
  ConditionStep,
  Step,
  WhileStep
} from "./types";

let nextId = 1;

export const buildActionStep = (action: string): ActionStep => ({
  id: nextId++,
  type: "action",
  action
});

export const buildConditionStep = (
  condition: string,
  steps: Array<Step> = []
): ConditionStep => ({
  id: nextId++,
  type: "condition",
  condition,
  steps
});

export const buildBranchStep = (
  conditions: Array<ConditionStep> = []
): BranchStep => ({
  id: nextId++,
  type: "branch",
  conditions
});

export const buildWhileStep = (
  condition: string | null,
  steps: Array<Step> = []
): WhileStep => ({
  id: nextId++,
  type: "while",
  condition,
  steps: steps.slice()
});
