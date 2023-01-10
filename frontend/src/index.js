import "./app.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { MantineProvider, Global } from "@mantine/core";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <MantineProvider 
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        primaryColor: 'dark',
        fontFamily: 'poppins',
        headings: {
          // properties for all headings
          fontWeight: 500,
          fontFamily: 'poppins'
        }
      }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
);
