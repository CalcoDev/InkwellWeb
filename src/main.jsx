import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/home.page";
import SignIn from "./pages/sign-in/sign-in.page";
import SignUp from "./pages/sign-up/sign-up.page";
import ProjectDashboard from "./pages/project-dashboard/project-dashboard.page";
import ProjectsSelect from "./pages/projects-select/projects-select.page";

const paths = [
    { path: "/", component: Home },
    { path: "/sign-in", component: SignIn },
    { path: "/sign-up", component: SignUp },
    { path: "/projects", component: ProjectsSelect },
    { path: "/project/:id", component: ProjectDashboard },
];

const router = createBrowserRouter(paths);

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <RouterProvider router={router} />
    </>
);
