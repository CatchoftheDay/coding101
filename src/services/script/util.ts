import {
  ActionStep,
  BranchStep,
  ConditionalStep,
  NonConditionalStep,
  WhileStep
} from "./types";

let nextId = 1;

export const buildActionStep = (action: string): ActionStep => ({
  id: nextId++,
  type: "action",
  action
});

export const buildConditionalStep = (
  condition: string,
  steps: Array<NonConditionalStep> = []
): ConditionalStep => ({
  id: nextId++,
  type: "conditional",
  condition,
  steps
});

export const buildBranchStep = (
  conditions: Array<ConditionalStep> = []
): BranchStep => ({
  id: nextId++,
  type: "branch",
  conditions
});

export const buildWhileStep = (
  condition: string | null,
  steps: Array<NonConditionalStep> = []
): WhileStep => ({
  id: nextId++,
  type: "while",
  condition,
  steps: steps.slice()
});
