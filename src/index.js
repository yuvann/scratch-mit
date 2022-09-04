import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "tailwindcss/tailwind.css";
import { Provider } from 'react-redux'
import store from "./store";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import DevNoteComponent from "./DevNote";

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <Router>
          <div>
            <Routes>
              <Route path="/dev" element={<DevNoteComponent />}>
              </Route>
              <Route path="/" element={<App/>}></Route>
            </Routes>
          </div>
        </Router>
      </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
