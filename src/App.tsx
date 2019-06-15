import React, { Component } from "react";
import ContainerDimensions from "react-container-dimensions";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import "./App.scss";
import Controls from "./containers/controls";
import MazeAndRunner from "./containers/mazeAndRunner";
import {
  executeActions,
  resetOnScriptChange
} from "./services/runner/middleware";
import StepList from "./services/script/containers/stepList";
import reducers, { initialState } from "./services/runner/reducers";
import Palette from "./components/palette";
import { Col, Row } from "react-bootstrap";

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
          <Row style={{ flex: 1, display: "flex", margin: "15px" }}>
            <Col className="col-md-4 col-lg-3 col-xl-5">
              <div style={{ position: "relative", height: "100%" }}>
                <ContainerDimensions>
                  <MazeAndRunner />
                </ContainerDimensions>
              </div>
            </Col>
            <Col className="col-md-5 col-lg-7 col-xl-5">
              <StepList />
            </Col>
            <Col className="col-md=3 col-lg-2 col-xl-2">
              <Palette
                style={{ flex: 0 }}
                actions={["turnLeft", "turnRight", "moveForward"]}
                conditions={[
                  "atFinish",
                  "notAtFinish",
                  "canMoveLeft",
                  "canMoveForward",
                  "canMoveRight"
                ]}
                controls={["branch", "while"]}
              />
            </Col>
          </Row>
        </DragDropContextProvider>
      </Provider>
    );
  }
}

export default App;
