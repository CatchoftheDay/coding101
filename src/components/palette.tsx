import React, { CSSProperties, ReactElement, ReactNode } from "react";
import Condition from "../services/script/components/condition";
import Step from "../services/script/components/step";

const spacerStyle = { marginTop: "1em" };

const Palette = ({
  actions,
  conditions,
  controls,
  style
}: {
  actions: ReadonlyArray<{ id: string; label: string | ReactElement }>;
  conditions: ReadonlyArray<{ id: string; label: string | ReactElement }>;
  controls: ReadonlyArray<{ id: string; label: string | ReactElement }>;
  style?: CSSProperties;
}) => {
  const widgets: ReactNode[] = [];

  if (actions.length) {
    widgets.push(
      <div
        key={"actionsHeader"}
        style={widgets.length ? spacerStyle : undefined}
      >
        <strong>Actions</strong>
      </div>
    );
    actions.forEach((action, idx) =>
      widgets.push(
        <Step
          key={`action${idx}`}
          step={{ id: -1, type: "action", action: action.id }}
        />
      )
    );
  }

  if (controls.length) {
    widgets.push(
      <div
        key={"controlsHeader"}
        style={widgets.length ? spacerStyle : undefined}
      >
        <strong>Control</strong>
      </div>
    );
    controls.forEach((control, idx) => {
      if (control.id === "branch") {
        widgets.push(
          <Step
            key={`control${idx}`}
            step={{ id: -1, type: "branch", conditions: [] }}
            paletteItem
          />
        );
      } else if (control.id === "while") {
        widgets.push(
          <Step
            key={`control${idx}`}
            step={{ id: -1, type: "while", conditions: [], steps: [] }}
            paletteItem
          />
        );
      }
    });
  }

  if (conditions.length) {
    widgets.push(
      <div
        key={"conditionsHeader"}
        style={widgets.length ? spacerStyle : undefined}
      >
        <strong>Conditions</strong>
      </div>
    );
    conditions.forEach((condition, idx) =>
      widgets.push(
        <Condition
          key={`condition${idx}`}
          conditionIdx={0}
          conditions={[condition.id]}
        />
      )
    );
  }

  return <div style={style}>{widgets}</div>;
};

export default Palette;
