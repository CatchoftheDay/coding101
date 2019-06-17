import React from "react";
import { Button } from "react-bootstrap";

const Controls = ({
  running,
  crashed,
  done,
  onReset,
  onStep,
  onRun,
  onPause,
  onNewMaze,
  showNewMaze
}: {
  running: boolean;
  crashed: boolean;
  done: boolean;
  onReset?: () => void;
  onStep?: () => void;
  onRun?: () => void;
  onPause?: () => void;
  onNewMaze?: () => void;
  onSetSize?: (size: number) => void;
  showNewMaze: boolean;
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
            disabled={crashed || done}
            variant="outline-primary"
            onClick={onStep}
          >
            Step
          </Button>
        )}
        {(running ? onPause : onRun) && (
          <Button
            style={{ marginRight: "5px" }}
            disabled={crashed || done}
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
        {showNewMaze && onNewMaze && (
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
