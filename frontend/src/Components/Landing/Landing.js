import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton"
import "./Landing.css";

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <div class="intro pb-5">
        <h1>Welcome to Hopscotch!</h1>
        <p class="para-center mt-5 mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eros enim, condimentum eu faucibus et, hendrerit non urna. Suspendisse vitae convallis libero. Aliquam tempus lacus et augue congue euismod. Sed eleifend tristique sapien eu iaculis. Integer quis auctor felis. Nam volutpat ante ac ipsum rutrum dapibus. Proin lobortis diam at arcu maximus cursus. Etiam sit amet lacus rhoncus, auctor velit et, faucibus justo.</p>
        {!isAuthenticated && (
          <div><LoginButton btntext="Get Started" /></div>
        )}
        {isAuthenticated && (
          <div class="mt-5">
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <LogoutButton />
          </div>
        )}
      </div>
      <div>
        <h1>Yooo hahah</h1>
      </div>
    </div>
  );
}
