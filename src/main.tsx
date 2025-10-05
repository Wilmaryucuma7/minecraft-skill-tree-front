import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "@/index.css";
import App from "@/App";
import { Provider } from "react-redux";
import { store } from "@/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
