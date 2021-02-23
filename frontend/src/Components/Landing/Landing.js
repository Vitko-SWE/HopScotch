import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton"
import "./Landing.css";
import {Link} from 'react-router-dom'

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();
  if (isAuthenticated) {
    return (
      <Link to="homepage"/>
    )
  }
  else {
    return(
      <div>
        <Link to="/"/>
        <h1>Welcome to Hopscotch</h1>
        <LoginButton />
      </div>
    )
  }

  // return (
  //   <div>
  //     <br />
  //     <br />
  //     <br />
  //     <p>Welcome to Hopscotch!</p>
  //     <LoginButton />
  //     <br />
  //     {isAuthenticated && (
  //       <div>
  //         <img src={user.picture} alt={user.name} />
  //         <h2>{user.name}</h2>
  //         <p>{user.email}</p>
  //       </div>
  //     )}
  //   </div>
  // )
}
