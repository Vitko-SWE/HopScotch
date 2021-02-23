import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import './MenuBar.css';
import LogoutButton from "../LogoutButton"

export default function MenuBar() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <header className="menubar sticky-nav">
        <nav className="menubar_navigation">
            <div className="menubar_logo"><a href="/">Hopscotch | My Trips</a></div>
            <div className="spacer" />
            <div className="menubar_nav_items">
                <ul>
                    <li><a href="/">Search</a></li>
                    {isAuthenticated && (
                      <li><a href="/">Hi, {user.name}!</a></li>
                    )}
                    {isAuthenticated && (
                      <li><LogoutButton /></li>
                    )}
                </ul>
            </div>
        </nav>
    </header>
  );
};
