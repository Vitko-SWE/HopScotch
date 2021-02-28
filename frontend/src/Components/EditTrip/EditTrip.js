import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./EditTrip.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";

export default function EditTrip(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [tripInfo, getTripInfo] = useState({});
  const [tripOwners, getTripOwners] = useState([]);
  const [tripEditors, getTripEditors] = useState([]);
  const [tripViewers, getTripViewers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();

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
        setStartDate(new Date(res.data.StartDate.toString()));
        setEndDate(new Date(res.data.EndDate.toString()));
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

  const handleEditDetails = (e) => {
    e.preventDefault();
    const results = e.currentTarget;

    let errors = "";

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
        axios.post(`http://localhost:5000/trips/updatetrip/${props.match.params.tripid}`, {
          title: results.tripTitle.value,
          origin: results.tripOrigin.value,
          destination: results.tripDestination.value,
          startdate: `${startDate.getFullYear()}-${("00" + (startDate.getMonth() + 1)).slice(-2)}-${("00" + startDate.getDate()).slice(-2)}`,
          enddate: `${endDate.getFullYear()}-${("00" + (endDate.getMonth() + 1)).slice(-2)}-${("00" + endDate.getDate()).slice(-2)}`,
          outboundflightid: results.tripOutboundFlightID.value,
          inboundflightid: results.tripInboundFlightID.value,
          features: results.tripFeatures.value,
        }, {
          headers: {
            userid: user.sub,
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res);
          history.push(`/edittrip/${props.match.params.tripid}}`);
        }).catch((err) => {
          alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
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
            Add Collaborators
          </Row>
          <Row>
            <div>
              <h5>Edit Trip Details</h5>
              <Form onSubmit={handleEditDetails}>
                <Container>
                  <Row>
                    <Col>
                      <Form.Group controlId="tripTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control required defaultValue={tripInfo.Name} />
                      </Form.Group>
                      <Form.Group controlId="tripOrigin">
                        <Form.Label>Origin</Form.Label>
                        <Form.Control required defaultValue={tripInfo.Origin} />
                      </Form.Group>
                      <Form.Group controlId="tripDestination">
                        <Form.Label>Destination</Form.Label>
                        <Form.Control required defaultValue={tripInfo.Destination} />
                      </Form.Group>
                      <Form.Group controlId="tripStartDate">
                        <Form.Label>Start Date</Form.Label><br />
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="MM/dd/yyyy" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="tripOutboundFlightID">
                        <Form.Label>Outbound Flight ID</Form.Label>
                        <Form.Control required defaultValue={tripInfo.OutboundFlightId} />
                      </Form.Group>
                      <Form.Group controlId="tripInboundFlightID">
                        <Form.Label>Inbound Flight ID</Form.Label>
                        <Form.Control required defaultValue={tripInfo.InboundFlightId} />
                      </Form.Group>
                      <Form.Group controlId="tripFeatures">
                        <Form.Label>Features</Form.Label>
                        <Form.Control required defaultValue={tripInfo.Features} />
                      </Form.Group>
                      <Form.Group controlId="tripEndDate">
                        <Form.Label>End Date</Form.Label><br />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="MM/dd/yyyy" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
                <Button variant="primary" type="submit">Submit</Button>
                {" "}
                <Link to={`/edittrip/${props.match.params.tripid}}`}><Button variant="outline-secondary">Cancel</Button></Link>
              </Form>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};
