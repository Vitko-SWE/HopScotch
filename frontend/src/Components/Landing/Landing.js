import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from 'react-bootstrap';

import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton"
import "./Landing.css";
import { Link } from 'react-router-dom'

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <div className="intro pt-5 pb-5">
        <h1>Welcome to Hopscotch!</h1>
        <p className="para-center mt-5 mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eros enim, condimentum eu faucibus et, hendrerit non urna. Suspendisse vitae convallis libero. Aliquam tempus lacus et augue congue euismod. Sed eleifend tristique sapien eu iaculis. Integer quis auctor felis. Nam volutpat ante ac ipsum rutrum dapibus. Proin lobortis diam at arcu maximus cursus. Etiam sit amet lacus rhoncus, auctor velit et, faucibus justo.</p>
        {!isAuthenticated && (
          <div>
            <LoginButton btntext="Get Started" />
          </div>
        )}
        {isAuthenticated && (
          <div className="mt-5">
            <h2>Hi {user.name}!</h2>
            <Link to="homepage"/>
          </div>
        )}
      </div>
      <div className="pt-5 pb-5">
        <Container>
          <Row>
            <Col>
              <div>
                <h3>Suspendisse potenti</h3>
                <p>Duis placerat aliquet convallis. Pellentesque rutrum nunc et mollis commodo. Nullam at sollicitudin odio, vitae tempus ligula.</p>
              </div>
            </Col>
            <Col>
              <div className="first-card">
                <h1>Hello World!</h1>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
