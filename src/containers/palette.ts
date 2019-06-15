import { TutorialState } from "../types";
import { getStage } from "../selectors";
import { connect } from "react-redux";
import _Palette from "../components/palette";
import { actions, conditions, controls } from "../constants";

const mapStateToProps = (state: TutorialState) => ({
  actions: actions
    .filter(action => action.stage <= getStage(state))
    .map(action => action.step),
  conditions: conditions
    .filter(condition => condition.stage <= getStage(state))
    .map(condition => condition.step),
  controls: controls
    .filter(control => control.stage <= getStage(state))
    .map(control => control.step)
});

export default connect(mapStateToProps)(_Palette);
