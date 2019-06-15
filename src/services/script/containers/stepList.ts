import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getRunner } from "../../../selectors";
import { TutorialState } from "../../../types";
import { getCurrentStep, getScript, isCrashed } from "../../runner/selectors";
import { deleteStep, insertStep } from "../actions";
import _StepList from "../components/stepList";
import { Step as StepModel } from "../types";

const mapStateToProps = (state: TutorialState) => ({
  steps: getScript(getRunner(state)),
  script: getScript(getRunner(state)),
  activeStep: getCurrentStep(getRunner(state)),
  crashed: isCrashed(getRunner(state))
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
