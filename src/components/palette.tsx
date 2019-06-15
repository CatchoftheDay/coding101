import React, { CSSProperties, ReactNode } from "react";
import Condition from "../services/script/components/condition";
import Step from "../services/script/components/step";

const spacerStyle = { marginTop: "1em" };

const Palette = ({
  actions,
  conditions,
  controls,
  style
}: {
  actions: ReadonlyArray<string>;
  conditions: ReadonlyArray<string>;
  controls: ReadonlyArray<string>;
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
        <Step key={`action${idx}`} step={{ id: -1, type: "action", action }} />
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
      if (control === "branch") {
        widgets.push(
          <Step
            key={`control${idx}`}
            step={{ id: -1, type: "branch", conditions: [] }}
            paletteItem
          />
        );
      } else if (control === "while") {
        widgets.push(
          <Step
            key={`control${idx}`}
            step={{ id: -1, type: "while", condition: null, steps: [] }}
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
      widgets.push(<Condition key={`condition${idx}`} condition={condition} />)
    );
  }

  return <div style={style}>{widgets}</div>;
};

export default Palette;
