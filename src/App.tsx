import React, { Component } from "react";
import "./App.css";
import Maze from "./components/maze";
import MazeModel from "./services/maze/maze";

const maze = new MazeModel({ width: 5 });

class App extends Component {
  render() {
    return (
      <div style={{ width: "500px", height: "500px", position: "relative" }}>
        <Maze maze={maze} />
      </div>
    );
  }
}

export default App;
