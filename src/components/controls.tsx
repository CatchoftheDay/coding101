import React from "react";

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
    <div style={{ borderBottom: "1px solid black", padding: "5px" }}>
      {onStep && (
        <button disabled={crashed} onClick={onStep}>
          Step
        </button>
      )}
      {(running ? onPause : onRun) && (
        <button disabled={crashed} onClick={running ? onPause : onRun}>
          {running ? "Pause" : "Run"}
        </button>
      )}
      {onReset && <button onClick={onReset}>Reset</button>}
      {onNewMaze && <button onClick={onNewMaze}>Generate new maze</button>}
      {/*{onSetSize && <button onClick={onStep}>Step</button>}*/}
    </div>
  );
};

export default Controls;
