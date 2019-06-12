import React, { Component } from "react";
import ContainerDimensions from "react-container-dimensions";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import "./App.css";
import Controls from "./containers/controls";
import MazeAndRunner from "./containers/mazeAndRunner";
import {
  executeActions,
  resetOnScriptChange
} from "./services/runner/middleware";
import StepList from "./services/script/containers/stepList";
import reducers, { initialState } from "./services/runner/reducers";
import Palette from "./components/palette";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(executeActions, resetOnScriptChange))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <Controls />
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ flex: 1 }}>
              <ContainerDimensions>
                <MazeAndRunner />
              </ContainerDimensions>
            </div>
            <StepList style={{ flex: 0 }} />
            <Palette
              style={{ flex: 0 }}
              actions={["turnLeft", "turnRight", "moveForward"]}
              conditions={[
                "atExit",
                "notAtExit",
                "canMoveLeft",
                "canMoveForward",
                "canMoveRight"
              ]}
            />
          </div>
        </DragDropContextProvider>
      </Provider>
    );
  }
}

export default App;
