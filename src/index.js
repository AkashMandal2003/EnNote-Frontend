import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//wrap the entire application by context provider so that we can access value anywhere in our project without any props drellings
import { ContextProvider } from "./store/ContextApi";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ContextProvider>
        <App />
    </ContextProvider>
);
