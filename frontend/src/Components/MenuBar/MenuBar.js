import React from 'react'
import './MenuBar.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import {Nav, Navbar, NavDropdown, Form, Button, FormControl} from 'react-bootstrap'


const menubar = props => (

<Navbar bg="dark" variant="dark" expand="lg">
  <Navbar.Brand href="/">Hopscotch</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/"> My Trips</Nav.Link>
      <NavDropdown title="Search Options" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Search Flights</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Search Hotels</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Search Other</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    <Nav>
      <Nav.Link href="/Account" >Account Details</Nav.Link>
      <Button variant="outline-light">Logout</Button>
    </Nav>
  </Navbar.Collapse>
</Navbar>
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
)

export default menubar