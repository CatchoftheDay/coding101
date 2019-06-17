import _Controls from "../components/controls";
import { isCrashed, isDone, isRunning } from "../services/runner/selectors";
import { Dispatch } from "redux";
import { newMaze, reset, run, step, stop } from "../services/runner/actions";
import { connect } from "react-redux";
import { Stage, TutorialState } from "../types";
import { getRunner, getStage } from "../selectors";

const mapStateToProps = (state: TutorialState) => ({
  crashed: isCrashed(getRunner(state)),
  done: isDone(getRunner(state)),
  running: isRunning(getRunner(state)),
  showNewMaze: getStage(state) >= Stage.CONTROL
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onStep: () => dispatch(step()),
  onRun: () => dispatch(run()),
  onStop: () => dispatch(stop()),
  onReset: () => dispatch(reset()),
  onNewMaze: () => dispatch(newMaze())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_Controls);
