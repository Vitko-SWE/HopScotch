import React from 'react'
import './MenuBar.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import {Nav, Navbar, NavDropdown, Form, Button, FormControl} from 'react-bootstrap'
import { useAuth0 } from "@auth0/auth0-react";


const Menubar = (props) => {
  const {user, isAuthenticated, logout } = useAuth0();
  if (isAuthenticated) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand >
          <Link className="link" to="homepage" >Hopscotch</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link> 
              <Link className="mytrips-link" to="homepage" >My Trips</Link>
            </Nav.Link>
            <NavDropdown  title="Search Options" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Search Flights</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Search Hotels</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Search Other</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link >
              <Link className="account-details" to="Account" >Account Details</Link>
            </Nav.Link>
            <Button variant="outline-light" onClick={() => logout()}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
  else {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">Hopscotch</Navbar.Brand>
      </Navbar>
    )
  }
    // <header className="menubar">
    //     <nav className="menubar_navigation">
    //         <div className="menubar_logo"><Link to="/">Hopscotch | My Trips</Link></div>
    //         <div className="spacer" />
    //         <div className="menubar_nav_items">
    //             <ul>
    //                 {/* <li><a href="/">Search</a></li> */}
    //                 <Link to="/Account">Account</Link>
    //             </ul>
    //         </div>
    //     </nav>
    // </header>
}

export default Menubar