import React, { Component } from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./App.css";
import { mazeRunner } from "./services/script/constants";
import StepContainer from "./services/script/components/stepContainer";

class App extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div style={{ width: "500px", height: "500px", position: "relative" }}>
          <StepContainer steps={mazeRunner} />
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
