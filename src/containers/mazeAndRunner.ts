import _MazeAndRunner from "../components/mazeAndRunner";
import {
  getFacing,
  getLocation,
  getMaze,
  isCrashed
} from "../services/runner/selectors";
import { RunnerState } from "../services/runner/types";
import { connect } from "react-redux";

const mapStateToProps = (state: RunnerState) => ({
  maze: getMaze(state),
  crashed: isCrashed(state),
  location: getLocation(state),
  facing: getFacing(state)
});

export default connect(mapStateToProps)(_MazeAndRunner);
