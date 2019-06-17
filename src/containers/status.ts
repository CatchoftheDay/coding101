import { connect } from "react-redux";
import { TutorialState } from "../types";
import {
  getStatus,
  hasKey,
  isAtFinish,
  isCrashed,
  isDone
} from "../services/runner/selectors";
import { getRunner } from "../selectors";
import Status from "../components/status";

const mapStateToProps = (state: TutorialState) => ({
  variables: hasKey(getRunner(state)) ? ["hasKey"] : [],
  status: getStatus(getRunner(state)),
  statusColor: isCrashed(getRunner(state))
    ? "red"
    : isAtFinish(getRunner(state)) && isDone(getRunner(state))
    ? "green"
    : "black"
});

export default connect(mapStateToProps)(Status);
