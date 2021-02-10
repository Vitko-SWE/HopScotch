import React from 'react'
import './MenuBar.css'


const menubar = props => (
    <header className="menubar">
        <nav className="menubar_navigation">
            <div className="menubar_logo"><a href="/">Hopscotch | My Trips</a></div>
            <div className="spacer" />
            <div className="menubar_nav_items">
                <ul>
                    <li><a href="/">Search</a></li>
                    <li><a href="/">Profile Picture</a></li>
                </ul>
            </div>
        </nav>
    </header>
)

export default menubar