import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton"
import "./Landing.css";

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <br />
      <br />
      <br />
      <p>Welcome to Hopscotch!</p>
      {!isAuthenticated && (
        <LoginButton />
      )}
      {isAuthenticated && (
        <LogoutButton />
      )}
      <br />
      {isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  )
}
