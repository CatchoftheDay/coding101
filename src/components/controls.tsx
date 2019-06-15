import React from "react";
import { Button } from "react-bootstrap";

const Controls = ({
  running,
  crashed,
  onReset,
  onStep,
  onRun,
  onPause,
  onNewMaze
}: {
  running: boolean;
  crashed: boolean;
  onReset?: () => void;
  onStep?: () => void;
  onRun?: () => void;
  onPause?: () => void;
  onNewMaze?: () => void;
  onSetSize?: (size: number) => void;
}) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #ccc",
        padding: "5px",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <div>
        {onStep && (
          <Button
            style={{ marginRight: "5px" }}
            disabled={crashed}
            variant="outline-primary"
            onClick={onStep}
          >
            Step
          </Button>
        )}
        {(running ? onPause : onRun) && (
          <Button
            style={{ marginRight: "5px" }}
            disabled={crashed}
            variant="outline-primary"
            onClick={running ? onPause : onRun}
          >
            {running ? "Pause" : "Run"}
          </Button>
        )}
        {onReset && (
          <Button
            style={{ marginRight: "5px" }}
            variant="outline-secondary"
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>
      <div>
        {onNewMaze && (
          <Button
            style={{ marginRight: "5px" }}
            variant="outline-secondary"
            onClick={onNewMaze}
          >
            Generate new maze
          </Button>
        )}
      </div>
    </div>
  );
};

export default Controls;
