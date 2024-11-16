import React from "react";
import Header from "./components/Header";
import { Outlet,useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const location = useLocation();
  const isSignInPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/register";
  const isPage = location.pathname === "/";

  if (isSignInPage || isSignUpPage || isPage) {
    return (
      <>
        <ToastContainer />
        <Outlet />
      </>
    );
  }
  return (
    <>
      <Header />
      <ToastContainer />
        <Outlet />
    </>
  );
};

export default App;
