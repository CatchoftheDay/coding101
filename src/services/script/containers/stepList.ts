import _StepList from "../components/stepList";
import { connect } from "react-redux";
import { Script } from "../types";

const mapStateToProps = (state: Script) => ({ steps: state });

export default connect(mapStateToProps)(_StepList);
