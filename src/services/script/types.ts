export interface BaseStep {
  id: number;
}

export interface ConditionalStep extends BaseStep {
  type: "conditional";
  // A null condition means always execute the steps
  condition: string | null;
  steps: Array<NonConditionalStep>;
}

export interface ActionStep extends BaseStep {
  type: "action";
  action: string;
}

export interface BranchStep extends BaseStep {
  type: "branch";
  // The conditions are checked sequentually and the first one that matches
  // is run
  conditions: Array<ConditionalStep>;
}

export interface WhileStep extends BaseStep {
  type: "while";
  // A null condition means execute the steps forever
  condition: string | null;
  steps: Array<NonConditionalStep>;
}

/** A non-condition step in a script */
export type NonConditionalStep = ActionStep | BranchStep | WhileStep;

/** An individual step in a script */
export type Step = NonConditionalStep | ConditionalStep;

/** A script for the runner to run */
export type Script = ReadonlyArray<NonConditionalStep>;

/** The function to call when a step is inserted */
export type OnInsert = (
  step: Step,
  parent: Step | undefined,
  before: Step | undefined
) => void;
