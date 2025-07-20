import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/login";
import Verifyotp from './auth/Verifyotp';
import { Test } from "./dashboard/Test";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Signup />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/verifyotp",
      element: <Verifyotp />,
    },
    {
      path: "/test",
      element: <Test />,
    },
  ]);

  return (
    <div className="h-full">
      <ToastContainer position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;