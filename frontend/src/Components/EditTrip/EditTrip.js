import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from 'react-bootstrap';
import "./EditTrip.css";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function EditTrip(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [tripInfo, getTripInfo] = useState({});

  useEffect(() => {
    updateTripInfo();
  }, []);

  const updateTripInfo = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`http://localhost:5000/trips/gettrip/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripInfo(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  return (
    <div>
      <div class="intro pt-5 pb-5">
        <h1 class="pb-5">{tripInfo.Name}</h1>
        <Container>
          <Row>
            <Col>
              <p><strong>Origin:</strong> {tripInfo.Origin}</p>
              <p><strong>Destination:</strong> {tripInfo.Destination}</p>
              <p><strong>Start Date:</strong> {tripInfo.StartDate}</p>
              <p><strong>End Date:</strong> {tripInfo.EndDate}</p>
              <p><strong>Outbound Flight ID:</strong> {tripInfo.OutboundFlightId}</p>
              <p><strong>Inbound Flight ID:</strong> {tripInfo.InboundFlightId}</p>
            </Col>
            <Col>
              <p><strong>Features:</strong> {tripInfo.Features}</p>
              <p><strong>Locked?</strong> {tripInfo.IsLocked === 0? "No" : "Yes"}</p>
            </Col>
          </Row>
        </Container>
      </div>
      <div class="pt-5 pb-5">
        <h3 class="pb-3">Actions</h3>
        <Container>
          <Row>

          </Row>
        </Container>
      </div>
    </div>
  );
};
