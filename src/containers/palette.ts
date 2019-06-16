import { TutorialState } from "../types";
import { getStage } from "../selectors";
import { connect } from "react-redux";
import _Palette from "../components/palette";
import { actions, conditions, controls } from "../constants";

const mapStateToProps = (state: TutorialState) => ({
  actions: actions.filter(action => action.stage <= getStage(state)),
  conditions: conditions.filter(
    condition => condition.stage <= getStage(state)
  ),
  controls: controls.filter(control => control.stage <= getStage(state))
});

export default connect(mapStateToProps)(_Palette);
