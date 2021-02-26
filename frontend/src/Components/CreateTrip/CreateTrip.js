import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./CreateTrip.css";

export default function CreateTrip() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <h1>Create Trip</h1>
    </div>
  );
};
