import React from 'react'
import './MenuBar.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


const menubar = props => (
    <header className="menubar">
        <nav className="menubar_navigation">
            <div className="menubar_logo"><Link to="/">Hopscotch | My Trips</Link></div>
            <div className="spacer" />
            <div className="menubar_nav_items">
                <ul>
                    {/* <li><a href="/">Search</a></li> */}
                    <Link to="/Account">Account</Link>
                </ul>
            </div>
        </nav>
    </header>
)

export default menubar