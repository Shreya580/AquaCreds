import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clear all localStorage data for fresh start
localStorage.clear();

createRoot(document.getElementById("root")!).render(<App />);
