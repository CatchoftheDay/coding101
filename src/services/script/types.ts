export interface BaseStep {
  id: number;
}

export interface ConditionStep extends BaseStep {
  type: "condition";
  // A null condition means always execute the steps
  condition: string | null;
  steps: Array<Step>;
}

export interface ActionStep extends BaseStep {
  type: "action";
  action: string;
}

export interface BranchStep extends BaseStep {
  type: "branch";
  // The conditions are checked sequentually and the first one that matches
  // is run
  conditions: Array<ConditionStep>;
}

export interface WhileStep extends BaseStep {
  type: "while";
  // A null condition means execute the steps forever
  condition: string | null;
  steps: Array<Step>;
}

export type Step = ActionStep | BranchStep | WhileStep | ConditionStep;
