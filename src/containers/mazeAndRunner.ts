import _MazeAndRunner from "../components/mazeAndRunner";
import {
  doorOpen,
  getFacing,
  getLocation,
  getMaze,
  hasKey,
  isCrashed
} from "../services/runner/selectors";
import { connect } from "react-redux";
import { getRunner, getStage } from "../selectors";
import { Stage, TutorialState } from "../types";

const mapStateToProps = (state: TutorialState) => ({
  maze: getMaze(getRunner(state)),
  crashed: isCrashed(getRunner(state)),
  location: getLocation(getRunner(state)),
  facing: getFacing(getRunner(state)),
  showKey: getStage(state) >= Stage.VARIABLES && !hasKey(getRunner(state)),
  showDoor: getStage(state) >= Stage.VARIABLES && !doorOpen(getRunner(state))
});

export default connect(mapStateToProps)(_MazeAndRunner);
