import * as React from "react";
import * as ReactDOM from "react-dom";
import Router from "./Router";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Router />, document.querySelector("#root"));

serviceWorker.register({});
