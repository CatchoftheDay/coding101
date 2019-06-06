import _Controls from "../components/controls";
import { RunnerState } from "../services/runner/types";
import { isCrashed } from "../services/runner/selectors";
import { Dispatch } from "redux";
import { newMaze, reset, step } from "../services/runner/actions";
import { connect } from "react-redux";

const mapStateToProps = (state: RunnerState) => ({
  crashed: isCrashed(state),
  running: false
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onStep: () => dispatch(step()),
  onReset: () => dispatch(reset()),
  onNewMaze: () => dispatch(newMaze())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_Controls);
