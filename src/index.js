import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";

import combinedReducers from "./reducers/combined";

import App from "./App";
import "./index.css";

// Create a store using all of the combined reducers...
const store = createStore(combinedReducers);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);
