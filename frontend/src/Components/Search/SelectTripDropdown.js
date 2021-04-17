import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Dropdown, DropdownButton, Modal, Button, ListGroup, Col, Form } from 'react-bootstrap'
import { useHistory } from 'react-router';
import DatePicker from "react-datepicker";
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

export default function SelectTripDropdown(props) {
    const {user, getAccessTokenSilently} = useAuth0();
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripSelected, setTripSelected] = useState(-1)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const trips = useState({items: []});

    const history = useHistory();

    const handleTripChange = async (trip) => {
        
        console.log("trip if: " + trip.TripId)
        setTripSelected(trip.TripId)
        
        console.log(tripSelected)
    }

    const handleSelect = (item) => {
        console.log("trips to submit: " + tripSelected)
        console.log(startDate)
        console.log(endDate)
        setShow(false)


        const newFeature = {
            FeatureId: props.diningOption.id,
            FeatureType: "Dining",
            StartDateTime: startDate,
            EndDateTime: endDate,
            TripId: tripSelected
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            const authToken = res;
            axios.post('/api/search/selectDining', newFeature, {
                headers: {
                Authorization: `Bearer ${res}`,
                },
            }).then((res) => {

                axios.post("/api/trips/vote", {
                    tripid: tripSelected,
                    userid: user.sub,
                    featureid: props.diningOption.id,
                    isflight: 0,
                    score: 1
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }).then(res3 => {
                })
                .catch((err) =>{
                    console.log(err);
                });
            //   alert("The dining option has been added to the selected trip.");
            }).catch((err) => {
                console.log(err);
            });
        });

    }

    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            Add to trip
        </Button>

        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
            <Modal.Title>Please select trip, date, and time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={6} md={4}>
                            <ListGroup>
                                <ListGroup.Item variant="primary"><strong>Choose Trip</strong></ListGroup.Item>
                                {props.trips.map((item) => (
                                    <ListGroup.Item action  variant="light" onClick={() => handleTripChange(item)} as="button">{item.Name}</ListGroup.Item>
                                    ))}
                            </ListGroup>
                        </Col>
                        <Col>
                            <Form.Group controlId="tripStartDate">
                                <Form.Label><strong>Start Date and Time</strong></Form.Label><br />
                                <DatePicker selected={startDate} showTimeSelect onChange={(date) => setStartDate(date)} dateFormat="MM/dd/yyyy" />
                            </Form.Group>
                            <Form.Group controlId="tripEndDate">
                                <Form.Label><strong>End Date and Time</strong></Form.Label><br />
                                <DatePicker selected={endDate} showTimeSelect onChange={(date) => setEndDate(date)} dateFormat="MM/dd/yyyy" />
                            </Form.Group>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col >
                            <Form.Group controlId="disclaimer" >
                                <Form.Label>This is not a reservation, it's just a tool to help you organize your trip</Form.Label><br />
                                
                            </Form.Group>
                           
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSelect}>
                Save
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
  }
