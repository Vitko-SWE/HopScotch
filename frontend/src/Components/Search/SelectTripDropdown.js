import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Dropdown, DropdownButton, Modal, Button, ListGroup, Col, Form } from 'react-bootstrap'
import { useHistory } from 'react-router';
import DatePicker from "react-datepicker";
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import uuid from 'react-uuid';

export default function SelectTripDropdown(props) {

//     console.log(props)
    const { user, getAccessTokenSilently } = useAuth0();
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripSelected, setTripSelected] = useState(-1)
    const [trip, setTrip] = useState({})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const trips = useState({ items: [] });

    const history = useHistory();

    const handleTripChange = async (trip) => {

        console.log("trip if: " + trip.TripId)
        setTripSelected(trip.TripId)
        setTrip(trip)

        console.log(tripSelected)
    }

    const handleSelect = async (item) => {
        console.log("trips to submit: " + tripSelected)
        console.log(startDate)
        console.log(endDate)
        setShow(false)


        if (props.diningOption.price === "$") {
            props.diningOption.price = 5;
        }
        else if (props.diningOption.price === "$$") {
            props.diningOption.price = 20;
        }
        else if (props.diningOption.price === "$$$") {
            props.diningOption.price = 45;
        }
        else if (props.diningOption.price === "$$$$") {
            props.diningOption.price = 80;
        }

        const newFeature = {
            FeatureId: props.diningOption.id,
            FeatureType: "Dining",
            FeatureName: props.diningOption.name,
            BookingURL: props.diningOption.url,
            PictureURL: props.diningOption.image_url,
            StartDateTime: startDate,
            EndDateTime: endDate,
            TripId: tripSelected,
            price: props.diningOption.price,
        };

        const vote = {
            tripid: tripSelected,
            userid: user.sub,
            featureid: props.diningOption.id,
            isflight: 0,
            score: 1,
        }

        try {
            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let promise = null

            promise = await axios.post('/api/search/selectDining', newFeature, {
                headers: {
                    Authorization: token,
                }
            })

            promise = await axios.post("/api/trips/vote", vote, {
                headers: {
                    Authorization: token,
                }
            })

            postNotification()
        } catch (error) {
            console.log(error)
        }
    }

    const postNotification = async() => {
        // let newNotification = {
        //     UserId: user.sub,
        //     NotificationTitle: "Dining Feature Update",
        //     NotificationBody: `A dining feature was added to your ${trip.Name} trip.`,
        //     TripName: trip.Name,
        //     TripId: trip.TripId,
        //     NotificationId: uuid()
        // }

        let users = await getTripUsers(trip.TripId);
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let promise = null

        console.log("users")
        console.log(users)

        for (let i = 0; i < users.length; i++) {
            try {
                let newNotification = {
                    UserId: users[i].UserId,
                    NotificationTitle: "Dining Feature Update",
                    NotificationBody: `A dining feature was added to your ${trip.Name} trip.`,
                    TripName: trip.Name,
                    TripId: trip.TripId,
                    NotificationId: uuid()
                }
                promise = await axios.post(`/api/notifications/insertNotification`, newNotification, {
                    headers: {
                        Authorization: token,
                    }
                })
                console.log(" posting Notifications")
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getTripUsers = async (tripId) => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let promise = null

        promise = await axios.get(`/api/user/getTripUsers/${tripId}`, {
            headers: {
                Authorization: token,
            }
        })

        return promise.data;
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
                                        !item.IsLocked ?
                                            <div><ListGroup.Item action variant="light" onClick={() => handleTripChange(item)} as="button">{item.Name}</ListGroup.Item></div> :
                                            <div><ListGroup.Item disabled><del>{item.Name}</del></ListGroup.Item></div>
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
