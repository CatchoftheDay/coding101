import React, { Component } from "react";
import ContainerDimensions from "react-container-dimensions";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import "./App.css";
import Controls from "./containers/controls";
import MazeAndRunner from "./containers/mazeAndRunner";
import middleware from "./services/runner/middleware";
import StepList from "./services/script/containers/stepList";
import reducers, { initialState } from "./services/runner/reducers";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(middleware))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <Controls />
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <ContainerDimensions>
                <MazeAndRunner />
              </ContainerDimensions>
            </div>
            <StepList style={{ width: "33%" }} />
          </div>
        </DragDropContextProvider>
      </Provider>
    );
  }
}

export default App;
