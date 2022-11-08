import React from 'react';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import CrowdFunding from "./pages/CrowdFunding/CrowdFunding";
import SharedWallet from "./pages/SharedWallet/SharedWallet";
import * as ReactDOM from "react-dom/client";
import CommonPot from "./pages/CommonPot/CommonPot";
import Dashboard from "./pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: "sharedWallet",
                element: <SharedWallet/>,
            },
            {
                path: "crowdFunding",
                element: <CrowdFunding/>
            },
            {
                path: "commonPot",
                element: <CommonPot/>
            }
        ]
    },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
