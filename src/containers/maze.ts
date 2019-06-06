import _Maze from "../components/maze";
import { getMaze } from "../services/runner/selectors";
import { RunnerState } from "../services/runner/types";
import { connect } from "react-redux";

const mapStateToProps = (state: RunnerState) => ({ maze: getMaze(state) });

export default connect(mapStateToProps)(_Maze);
