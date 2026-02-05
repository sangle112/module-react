import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { SocketProvider } from "@/app/providers/SocketProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </QueryProvider>
    </AuthProvider>
  </React.StrictMode>,
);
