import React, { Component } from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./App.css";
import StepList from "./services/script/containers/stepList";
import { createStore } from "redux";
import reducers, { initialState } from "./services/runner/reducers";
import { Provider } from "react-redux";
import Maze from "./containers/maze";
import ContainerDimensions from "react-container-dimensions";

const store = createStore(
  reducers,
  initialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <ContainerDimensions>
                <Maze />
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
