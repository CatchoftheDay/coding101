import { connect } from "react-redux";
import { getStage } from "../selectors";
import { TutorialState } from "../types";
import _EventMonitor from "../components/eventMonitor";

const mapStateToProps = (state: TutorialState) => ({
  stage: getStage(state)
});

export default connect(mapStateToProps)(_EventMonitor);
