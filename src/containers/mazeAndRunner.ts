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
import { getRunner } from "../selectors";
import { TutorialState } from "../types";

const mapStateToProps = (state: TutorialState) => ({
  maze: getMaze(getRunner(state)),
  crashed: isCrashed(getRunner(state)),
  location: getLocation(getRunner(state)),
  facing: getFacing(getRunner(state)),
  showKey: !hasKey(getRunner(state)),
  showDoor: !doorOpen(getRunner(state))
});

export default connect(mapStateToProps)(_MazeAndRunner);
