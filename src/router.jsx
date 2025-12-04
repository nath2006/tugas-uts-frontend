import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pengaturan from "./pages/Pengaturan.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "pengaturan", Component: Pengaturan },
    ],
  },
]);

export default router;
