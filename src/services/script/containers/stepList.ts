import _StepList from "../components/stepList";
import { connect } from "react-redux";
import { Step as StepModel } from "../types";
import { Dispatch } from "redux";
import { deleteStep } from "../actions";
import { RunnerState } from "../../runner/types";
import { getScript } from "../../runner/selectors";

const mapStateToProps = (state: RunnerState) => ({ steps: getScript(state) });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDelete: (step: StepModel) => dispatch(deleteStep(step.id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_StepList);
