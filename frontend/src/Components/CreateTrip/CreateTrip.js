import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./CreateTrip.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Link, useHistory } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

export default function CreateTrip() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = e.currentTarget;
    const emails = results.tripOwners.value.replace(/\s/g,'').split(",");

    let errors = "";
    if (results.tripOwners.value !== "") {
      let valid = true;
      const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] === "" || emails[i] === user.email || !regex.test(emails[i])){
          valid = false;
        }
      }
      if (!valid) {
        errors += "Please make sure all owner emails are valid.\n";
      }
    }
    if (startDate === null || endDate === null) {
      errors += "Please enter a start date and an end date.\n";
    }
    else if (startDate >= endDate) {
      errors += "Please make sure the end date is after the start date.\n";
    }
    if (isNaN(results.tripInboundFlightID.value)) {
      errors += "Please enter a valid inbound flight ID.\n"
    }
    if (isNaN(results.tripOutboundFlightID.value)) {
      errors += "Please enter a valid outbound flight ID.\n"
    }

    if (errors !== "") {
      alert(errors);
    }
    else {
      getAccessTokenSilently({audience: "https://hopscotch/api"}).then((res) => {
        axios.post("http://localhost:5000/trips/createtrip", {
          title: results.tripTitle.value,
          origin: results.tripOrigin.value,
          destination: results.tripDestination.value,
          startdate: `${startDate.getFullYear()}-${("00" + (startDate.getMonth() + 1)).slice(-2)}-${("00" + startDate.getDate()).slice(-2)}`,
          enddate: `${endDate.getFullYear()}-${("00" + (endDate.getMonth() + 1)).slice(-2)}-${("00" + endDate.getDate()).slice(-2)}`,
          outboundflightid: results.tripOutboundFlightID.value,
          inboundflightid: results.tripInboundFlightID.value,
          features: results.tripFeatures.value,
          owners: emails,
        }, {
          headers: {
            userid: user.sub,
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res);
          history.push("/homepage");
        }).catch((err) => {
          alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
  };

  return (
    <div>
      <h1>Create Trip</h1>
      <Form onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col>
              <Form.Group controlId="tripTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control required />
              </Form.Group>
              <Form.Group controlId="tripOrigin">
                <Form.Label>Origin</Form.Label>
                <Form.Control required />
              </Form.Group>
              <Form.Group controlId="tripDestination">
                <Form.Label>Destination</Form.Label>
                <Form.Control required />
              </Form.Group>
              <Form.Group controlId="tripStartDate">
                <Form.Label>Start Date</Form.Label><br />
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="MM/dd/yyyy" />
              </Form.Group>
              <Form.Group controlId="tripEndDate">
                <Form.Label>End Date</Form.Label><br />
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="MM/dd/yyyy" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tripOutboundFlightID">
                <Form.Label>Outbound Flight ID</Form.Label>
                <Form.Control required />
              </Form.Group>
              <Form.Group controlId="tripInboundFlightID">
                <Form.Label>Inbound Flight ID</Form.Label>
                <Form.Control required />
              </Form.Group>
              <Form.Group controlId="tripFeatures">
                <Form.Label>Features</Form.Label>
                <Form.Control required />
              </Form.Group>
              <Form.Group controlId="tripOwners">
                <Form.Label>Owners</Form.Label>
                <Form.Text className="text-muted">
                  Enter email addresses separated by commas.
                </Form.Text>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>
        </Container>
        <Button variant="primary" type="submit">Submit</Button>
        {" "}
        <Link to="/homepage"><Button variant="outline-secondary">Cancel</Button></Link>
      </Form>
    </div>
  );
};
