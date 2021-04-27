import React from 'react'
import './MenuBar.css'
import LogoutButton from "../LogoutButton";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import {Nav, Navbar, NavDropdown, Form, Button, FormControl, Badge} from 'react-bootstrap'
import { useAuth0 } from "@auth0/auth0-react";
import { IoMdNotificationsOutline } from 'react-icons/io'
import { Dropdown, Toast } from 'react-bootstrap';
import Notifications from "../Notifications/Notifications"


const Menubar = (props) => {
  const {user, isAuthenticated } = useAuth0();
  if (isAuthenticated) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand >
          <Link className="link" to="/homepage" >Hopscotch</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              <Link className="mytrips-link" to="/homepage" >My Trips</Link>
            </Nav.Link>
            <Nav.Link>
              <Link className="mytrips-link" to="/map" >Map</Link>
            </Nav.Link>
            <NavDropdown  title="Search Options" id="basic-nav-dropdown">
              <NavDropdown.Item href="/search/flights">Search Flights</NavDropdown.Item>
              <NavDropdown.Item href="/searchHotel">Search Hotels</NavDropdown.Item>
              <NavDropdown.Item href="/searchDining">Search Dining</NavDropdown.Item>
              <NavDropdown.Item href="/attractionsearch">Search Attractions</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item><Link to="/search" >Search</Link></NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Notifications/>
           
            <Nav.Link >
              <Link className="account-details" to="/Account" >Account Details</Link>
            </Nav.Link>
              <LogoutButton/>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
  else {
    return(<div></div>)
  }
}

export default Menubar;
