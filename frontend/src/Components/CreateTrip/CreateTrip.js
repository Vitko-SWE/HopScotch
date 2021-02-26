import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./CreateTrip.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function CreateTrip() {
  const { user, getAccessTokenSilently } = useAuth0();

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = e.currentTarget;

    getAccessTokenSilently({audience: "https://hopscotch/api"}).then((res) => {
      axios.post("http://localhost:5000/homepage/createtrip", {
        title: results.tripTitle.value,
        origin: results.tripOrigin.value,
        destination: results.tripDestination.value,
        startdate: results.tripStartDate.value,
        enddate: results.tripEndDate.value,
        inboundflightid: results.tripInboundFlightID.value,
        outboundflightid: results.tripOutboundFlightID.value,
        features: results.tripFeatures.value,
      }, {
        headers: {
          userid: user.sub,
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  return (
    <div>
      <h1>Create Trip</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="tripTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripOrigin">
          <Form.Label>Origin</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripDestination">
          <Form.Label>Destination</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Text className="text-muted">
            YYYY-MM-DD
          </Form.Text>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Text className="text-muted">
            YYYY-MM-DD
          </Form.Text>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripInboundFlightID">
          <Form.Label>Inbound Flight ID</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripOutboundFlightID">
          <Form.Label>Outbound Flight ID</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group controlId="tripFeatures">
          <Form.Label>Features</Form.Label>
          <Form.Control />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
