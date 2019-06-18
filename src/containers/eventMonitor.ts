import { connect } from "react-redux";
import { getAchievements, getStage } from "../selectors";
import { TutorialState } from "../types";
import _EventMonitor from "../components/eventMonitor";

const mapStateToProps = (state: TutorialState) => ({
  stage: getStage(state),
  achievements: getAchievements(state)
});

export default connect(mapStateToProps)(_EventMonitor);
