import _Controls from "../components/controls";
import {
  isCrashed,
  isDone,
  isRunning,
  isSmallMaze
} from "../services/runner/selectors";
import { Dispatch } from "redux";
import {
  newMaze,
  reset,
  run,
  setSmallMaze,
  step,
  stop
} from "../services/runner/actions";
import { connect } from "react-redux";
import { Stage, TutorialState } from "../types";
import { getAchievements, getRunner, getStage } from "../selectors";
import achievements from "../achievements";

const mapStateToProps = (state: TutorialState) => ({
  crashed: isCrashed(getRunner(state)),
  done: isDone(getRunner(state)),
  running: isRunning(getRunner(state)),
  showNewMaze: getStage(state) >= Stage.CONTROL,
  smallMaze: isSmallMaze(getRunner(state)),
  showSmallMaze: getStage(state) >= Stage.CONTROL,
  achievementsGained: getAchievements(state).length,
  totalAchievements: achievements.length
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onStep: () => dispatch(step()),
  onRun: () => dispatch(run()),
  onStop: () => dispatch(stop()),
  onReset: () => dispatch(reset()),
  onNewMaze: () => dispatch(newMaze()),
  onSetSmallMaze: (smallMaze: boolean) => dispatch(setSmallMaze(smallMaze))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_Controls);
