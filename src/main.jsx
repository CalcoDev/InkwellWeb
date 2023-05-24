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
    { path: "/", element: <Home /> },
    { path: "/sign-in", element: <SignIn /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/projects", element: <ProjectsSelect /> },
    { path: "/project/:projectId", element: <ProjectDashboard /> },
];

const router = createBrowserRouter(paths);
ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <RouterProvider router={router} />
    </>
);
