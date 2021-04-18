import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import DatePicker from "react-datepicker";
import { Button, Modal, ListGroup, Col, Form, Container, Row} from "react-bootstrap"



export default function PoiModal(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripSelected, setTripSelected] = useState(-1)

    const handleClose = () => setShow(false);

    const handleShow = () => {
        if (props.trips.length === 0) {
          alert("You do not have any editable trips")
        }
        else {
          setShow(true)
        }
    }

    const handleTripChange = async (trip) => {
        setTripSelected(trip.TripId)
    }


    const addPOIToTrip = () => {

        setShow(false)
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
          axios.post("/api/search/addpoi/", {
            tripid: tripSelected,
            StartDateTime: startDate,
            EndDateTime: endDate,
            id: props.result.id,
            geoCode: props.result.geoCode,
          }, {
            headers: {
              Authorization: `Bearer ${res}`,
            },
          }).then((res) => {
            console.log(res.data);
            alert("The point of interest has been added to the selected trip.");
          }).catch((err) => {
            console.log(err);
          });
        });
      };


    
      


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
            <Button variant="primary" onClick={addPOIToTrip}>
                Save
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );


       
}


