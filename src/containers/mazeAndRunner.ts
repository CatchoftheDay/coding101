import _MazeAndRunner from "../components/mazeAndRunner";
import {
  getFacing,
  getLocation,
  getMaze,
  isCrashed
} from "../services/runner/selectors";
import { connect } from "react-redux";
import { getRunner } from "../selectors";
import { TutorialState } from "../types";

const mapStateToProps = (state: TutorialState) => ({
  maze: getMaze(getRunner(state)),
  crashed: isCrashed(getRunner(state)),
  location: getLocation(getRunner(state)),
  facing: getFacing(getRunner(state))
});

export default connect(mapStateToProps)(_MazeAndRunner);
