import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/home.page";
import SignIn from "./pages/sign-in/sign-in.page";
import SignUp from "./pages/sign-up/sign-up.page";
import ProjectDashboard from "./pages/project-dashboard/project-dashboard.page";
import ProjectsSelect from "./pages/projects-select/projects-select.page";
import { RecoilRoot } from "recoil";
import ProjectTableView from "./pages/views/tables/project-table-view.page";
import PageNotFound from "./pages/page-not-found/page-not-found.page";
import ProjectSettings from "./pages/project-settings/project-settings.page";
import ProjectUserManagement from "./pages/project-user-management/project-user-management.page";

const paths = [
    { path: "/", element: <Home /> },
    { path: "/sign-in", element: <SignIn /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/projects", element: <ProjectsSelect /> },
    { path: "/project/:projectId", element: <ProjectDashboard /> },
    { path: "/project/:projectId/settings", element: <ProjectSettings /> },
    { path: "/project/:projectId/users", element: <ProjectUserManagement /> },
    { path: "/project/:projectId/views/tables", element: <ProjectTableView /> },
    { path: "*", element: <PageNotFound /> },
];

const router = createBrowserRouter(paths, {
    basename: "/InkwellWeb",
});
ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <RecoilRoot>
            <RouterProvider router={router} />
        </RecoilRoot>
    </>
);
