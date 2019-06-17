import React, { useRef } from "react";
import { withToast } from "react-awesome-toasts";
import { ToastContext } from "react-awesome-toasts/dist/ToastContext/ToastContext.types";
import { Stage } from "../types";

const EventMonitor = ({
  stage,
  toast
}: {
  stage: Stage;
  toast: ToastContext;
}) => {
  const lastStage = useRef<Stage>(stage);

  if (stage !== lastStage.current) {
    if (stage === Stage.CONTROL) {
      toast.show({ text: "Welcome aboard, Captain!" });
    } else if (stage === Stage.VARIABLES) {
      toast.show({ text: "Access granted" });
    }
    lastStage.current = stage;
  }

  return <></>;
};

export default withToast(EventMonitor as any);
