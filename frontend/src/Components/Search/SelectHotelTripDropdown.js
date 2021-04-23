import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Modal, Button, ListGroup, Col, Form, Container, Row } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import uuid from 'react-uuid';


export default function SelectTripDropdown(props) {

    const {user, getAccessTokenSilently} = useAuth0();
    const trips = useState({items: []});
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripSelected, setTripSelected] = useState(-1)
    const [trip, setTrip] = useState({})
    const [success, setSuccess] = useState(false)
    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleTripChange = async (trip) => {

        console.log("trip if: " + trip.TripId)
        setTripSelected(trip.TripId)
        setTrip(trip)

        console.log(tripSelected)
    }

    const handleSelect = async (item) => {
        // console.log(item.TripId)

        const newFeature = {
            FeatureId: props.hotelOption.place_id,
            FeatureType: "Hotel",
            TripId: tripSelected,
            StartDateTime: startDate,
            EndDateTime: endDate,
            BookingUrl: props.hotelOption.website,
            FeatureName: props.hotelOption.name,
            Address: props.hotelOption.formatted_address
        }

        setShow(false)

        try {
            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let promise = null

            promise = await axios.post('/api/hotel/selectHotel', newFeature, {
                headers: {
                    Authorization: token,
                }
            })


            if (promise.status === 200) {
                setSuccess(true)
                alert("The hotel has been added to the selected trip.");
                postNotification()
            }
            else {
                alert("Ohh boy, looks like we have an error");
            }
    
        } catch (error) {
            console.log(error)
            
        }

        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //     axios.post('/api/hotel/selectHotel', newFeature, {
        //         headers: {
        //         Authorization: `Bearer ${res}`,
        //         },
        //     }).then((res) => {
        //       alert("The hotel has been added to the selected trip.");
        //     }).catch((err) => {
        //         console.log(err);
        //     });
        // });

    }




    const postNotification = async() => {
        let newNotification = {
            UserId: user.sub,
            NotificationTitle: "Hotel Update",
            NotificationBody: `A new hotel was added to your ${trip.Name} trip.`,
            TripName: trip.Name,
            TripId: trip.TripId,
            NotificationId: uuid()
        }

        let users = await getTripUsers(trip.TripId);
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let promise = null

        console.log("users")
        console.log(users)

        for (let i = 0; i < users.length; i++) {
            try {
                promise = await axios.post(`/api/notifications/insertNotification`, newNotification, {
                    headers: {
                        Authorization: token,
                    }
                })

                console.log("posting Notifications in hotels")
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
            <Button variant="secondary" onClick={() => handleClose()}>
                Close
            </Button>
            <Button variant="primary" onClick={() => handleSelect()}>
                Save
            </Button>
            </Modal.Footer>
        </Modal>
        </>

        // <DropdownButton id="dropdown-item-button" title="Select Trip to add to">
        //     <Dropdown.Header>Add hotel to trip</Dropdown.Header>
        //     {props.trips.map((item) => (
        //            <Dropdown.Item onClick={() => handleSelect(item)} as="button">{item.Name}</Dropdown.Item>
        //         ))}
        // </DropdownButton>
    );
  }
