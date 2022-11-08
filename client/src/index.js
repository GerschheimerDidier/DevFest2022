import React from 'react';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import CrowdFunding from "./pages/CrowdFunding/CrowdFunding";
import SharedWallet from "./pages/SharedWallet/SharedWallet";
import * as ReactDOM from "react-dom/client";
import Home from "./pages/Home/Home";
import CommonPot from "./pages/CommonPot/CommonPot";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>
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
