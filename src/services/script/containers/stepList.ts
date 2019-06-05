import _StepList from "../components/stepList";
import { connect } from "react-redux";
import { Script, Step as StepModel } from "../types";
import { Dispatch } from "redux";
import { deleteStep } from "../actions";

const mapStateToProps = (state: Script) => ({ steps: state });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDelete: (step: StepModel) => dispatch(deleteStep(step.id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_StepList);
