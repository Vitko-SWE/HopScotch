import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "../LoginButton/LoginButton";
import "./Landing.css";
import { Link, Redirect } from 'react-router-dom'

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <>
      <div>
        {isAuthenticated && (
            <Redirect to="/homepage"/>
        )}
      </div>
      <div>
        {!isAuthenticated && (
        <div className="background-gif">
          <h1 className="title-styling">Welcome to Hopscotch!</h1>
          <h2 className="subtitle-styling">Your all in one travel planner.</h2>
            <div>
              <LoginButton btntext="Log in/Sign up"/>
            </div>
        </div>
        )}
      </div>
    </>
  );
};
