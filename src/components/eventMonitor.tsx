import React, { useRef } from "react";
import { withToast } from "react-awesome-toasts";
import { ToastContext } from "react-awesome-toasts/dist/ToastContext/ToastContext.types";
import achievementDetails from "../achievements";
import { Stage } from "../types";

const EventMonitor = ({
  stage,
  achievements,
  toast
}: {
  stage: Stage;
  achievements: ReadonlyArray<string>;
  toast: ToastContext;
}) => {
  const lastStage = useRef<Stage>(stage);
  const lastAchievements = useRef<ReadonlyArray<string>>(achievements);

  if (stage !== lastStage.current) {
    if (stage === Stage.CONTROL) {
      toast.show({ text: "Welcome aboard, Captain!" });
    } else if (stage === Stage.VARIABLES) {
      toast.show({ text: "Expert mode enabled!" });
    }
    lastStage.current = stage;
  }

  achievements
    .filter(
      achievementId => lastAchievements.current.indexOf(achievementId) === -1
    )
    .forEach(achievementId => {
      const achievement = achievementDetails.find(
        ({ id }) => id === achievementId
      );

      toast.show({ text: `Achievement unlocked! ${achievement!.text}` });
    });
  lastAchievements.current = achievements;

  return <></>;
};

export default withToast(EventMonitor as any);
