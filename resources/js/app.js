require("./bootstrap");
import React from "react";
import { render } from "react-dom";
import Routes from "./components/routes/Routes";

render(<Routes />, document.getElementById("app"));
