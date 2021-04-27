import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from 'react-bootstrap';

import LoginButton from "../LoginButton/LoginButton";
import LogoutButton from "../LogoutButton"
import "./Landing.css";
import { Link } from 'react-router-dom'

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div >
      <div className="background-gif">
        <h1 className="title-styling">Welcome to Hopscotch!</h1>
        <h2 className="subtitle-styling">Your all in one travel planner.</h2>
        {!isAuthenticated && (
          <div>
            <LoginButton btntext="Log in/Sign up"/>
          </div>
        )}
        {isAuthenticated && (
          <div className="mt-5">
            <h2>Hi {user.name}!</h2>
            <Link to="homepage"/>
          </div>
        )}
      </div>
    </div>
  );
};
