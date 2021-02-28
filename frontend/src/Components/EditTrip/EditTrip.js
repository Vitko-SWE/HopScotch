import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from 'react-bootstrap';
import "./EditTrip.css";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function EditTrip(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [tripInfo, getTripInfo] = useState({});
  const [tripOwners, getTripOwners] = useState([]);
  const [tripEditors, getTripEditors] = useState([]);
  const [tripViewers, getTripViewers] = useState([]);

  useEffect(() => {
    updateTripInfo();
    updateTripOwners();
    updateTripEditors();
    updateTripViewers();
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
  const updateTripOwners = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`http://localhost:5000/trips/gettripowners/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripOwners(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };
  const updateTripEditors = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`http://localhost:5000/trips/gettripeditors/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripEditors(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };
  const updateTripViewers = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`http://localhost:5000/trips/gettripviewers/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripViewers(res.data);
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
              <p>
                <strong>Owners:</strong>{" "}
                {tripOwners.map((owner, i) => (
                  (i !== 0 ? ", " : "") + owner.Name
                ))}
              </p>
              <p>
                <strong>Editors:</strong>{" "}
                {tripEditors.length === 0 ? "N/A" : (tripEditors.map((editor, i) => (
                  (i !== 0 ? ", " : "") + editor.Name
                )))}
              </p>
              <p>
                <strong>Viewers:</strong>{" "}
                {tripViewers.length === 0 ? "N/A" : (tripViewers.map((viewer, i) => (
                  (i !== 0 ? ", " : "") + viewer.Name
                )))}
              </p>
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
