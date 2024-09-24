import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AppRoutes from "./Route";

document.addEventListener("DOMContentLoaded", () => {
  
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container missing in index.html");
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
});