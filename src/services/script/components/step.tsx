import React from "react";
import { NonConditionStep } from "../types";
import Action from "./action";
import Branch from "./branch";
import While from "./while";

const Step = ({ step }: { step: NonConditionStep }) => {
  switch (step.type) {
    case "action":
      return Action({ step });
    case "while":
      return While({ step });
    case "branch":
      return Branch({ step });
  }
};

export default Step;
