import React, { Component } from "react";
import "./App.css";
import { mazeRunner } from "./services/script/constants";
import Step from "./services/script/components/step";

class App extends Component {
  render() {
    return (
      <div style={{ width: "500px", height: "500px", position: "relative" }}>
        {mazeRunner.map(step => (
          <Step key={step.id} step={step} />
        ))}
      </div>
    );
  }
}

export default App;
