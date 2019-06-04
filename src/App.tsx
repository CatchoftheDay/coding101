import React, { Component } from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./App.css";
import { mazeRunner } from "./services/script/constants";
import StepList from "./services/script/containers/stepList";
import { createStore } from "redux";
import reducers from "./services/script/reducers";
import { Provider } from "react-redux";

const store = createStore(
  reducers,
  mazeRunner,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <div
            style={{ width: "500px", height: "500px", position: "relative" }}
          >
            <StepList />
          </div>
        </DragDropContextProvider>
      </Provider>
    );
  }
}

export default App;
