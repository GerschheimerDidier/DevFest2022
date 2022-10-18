import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import CrowdFunding from "./components/ContractsPage/CrowdFunding/CrowdFunding";
import SharedWallet from "./components/ContractsPage/SharedWallet/SharedWallet";
import NavBar from "./components/NavBar/NavBar";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/sharedWallet",
        element: <SharedWallet />,
    },

    {
        path: "/crowdFunding",
        element: <CrowdFunding />
    },

    <NavBar/>

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
