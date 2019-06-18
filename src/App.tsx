import React, { Component } from "react";
import { ToastProvider } from "react-awesome-toasts";
import ContainerDimensions from "react-container-dimensions";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import "./App.scss";
import Controls from "./containers/controls";
import EventMonitor from "./containers/eventMonitor";
import Palette from "./containers/palette";
import MazeAndRunner from "./containers/mazeAndRunner";
import {
  executeActions,
  resetOnScriptChange,
  run
} from "./services/runner/middleware";
import StepList from "./services/script/containers/stepList";
import reducers, { initialState } from "./reducers";
import { Col, Row } from "react-bootstrap";
import { addKey } from "./actions";
import { checkAchievements, checkCodes } from "./middleware";
import { getRunner } from "./selectors";
import Status from "./containers/status";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(
    applyMiddleware(
      executeActions(getRunner),
      resetOnScriptChange(getRunner),
      run(getRunner),
      checkCodes,
      checkAchievements
    )
  )
);

window.addEventListener("keypress", ({ key }) => store.dispatch(addKey(key)));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ToastProvider
          component={undefined!}
          position="bottom-center"
          timeout={undefined!}
        >
          <DragDropContextProvider backend={HTML5Backend}>
            <EventMonitor />
            <Controls />
            <Row style={{ flex: 1, display: "flex", margin: "15px" }}>
              <Col className="col-md-4 col-lg-3 col-xl-5">
                <div style={{ position: "relative", height: "100%" }}>
                  <ContainerDimensions>
                    <MazeAndRunner />
                  </ContainerDimensions>
                  <Status />
                </div>
              </Col>
              <Col
                className="col-md-5 col-lg-7 col-xl-5"
                style={{ maxHeight: "100%", overflow: "auto" }}
              >
                <StepList />
              </Col>
              <Col
                className="col-md=3 col-lg-2 col-xl-2"
                style={{ maxHeight: "100%", overflow: "auto" }}
              >
                <Palette style={{ flex: 0 }} />
              </Col>
            </Row>
          </DragDropContextProvider>
        </ToastProvider>
      </Provider>
    );
  }
}

export default App;
