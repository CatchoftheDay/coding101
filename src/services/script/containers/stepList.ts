import _StepList from "../components/stepList";
import { connect } from "react-redux";
import { Step as StepModel } from "../types";
import { Dispatch } from "redux";
import { deleteStep, insertStep } from "../actions";
import { RunnerState } from "../../runner/types";
import { getCurrentStep, getScript } from "../../runner/selectors";

const mapStateToProps = (state: RunnerState) => ({
  steps: getScript(state),
  script: getScript(state),
  activeStep: getCurrentStep(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDelete: (step: StepModel) => dispatch(deleteStep(step.id)),
  onInsert: (
    step: StepModel,
    parent: StepModel | undefined,
    before: StepModel | undefined
  ) => dispatch(insertStep(step, parent && parent.id, before && before.id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_StepList);
