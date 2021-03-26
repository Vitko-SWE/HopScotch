import React from 'react'
import { useState } from 'react'
import { Row, Col, Container, Button, Collapse, Card, Image } from 'react-bootstrap'
const airlines = require('../airlines.json')

export default function FlightCard(props) {
    const [deptOpen, setDeptOpen] = useState(false);
    const [retOpen, setRetOpen] = useState(false);

    return (
        <div>
            <Container fluid className="border p-3 rounded">
                <Row>
                    <Col xs={2} className="border-right">
                        {props.airlines.map((item, i) => {
                            return(
                                <div id={i}>
                                    <Image src={`/static/airlinelogos/${item}.png`} rounded fluid/>
                                    <h5>{airlines.find(x => x.code == item).name}</h5>
                                </div>
                            )
                        })}
                    </Col>
                    <Col>
                        <Button variant="outline-dark" className="mb-2" block onClick={() => setDeptOpen(!deptOpen)}>Departure Flight | {props.itineraries[0].duration.substring(2).toLowerCase()} | {props.itineraries[0].segments.length} Stops</Button>
                        <Collapse in={deptOpen} className="mb-2">
                            <div>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Flight Details</Card.Title>
                                        <ol>
                                            {props.itineraries[0].segments.map((item, i) => {
                                                return(
                                                    <li key={item.id}>Depart {item.departure.iataCode} at {item.departure.at} and land in {item.arrival.iataCode} at {item.arrival.at} local time.</li>
                                                )
                                            })}
                                        </ol>
                                    </Card.Header>
                                </Card>
                            </div>
                        </Collapse>
                        <Button variant="outline-dark" className="mb-2" block onClick={() => setRetOpen(!retOpen)}>Return Flight | {props.itineraries[1].duration.substring(2).toLowerCase()} | {props.itineraries[1].segments.length} Stops</Button>
                        <Collapse in={retOpen}>
                            <div>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Flight Details</Card.Title>
                                        <ol>
                                            {props.itineraries[1].segments.map((item, i) => {
                                                return(
                                                    <li key={item.id}>Depart {item.departure.iataCode} at {item.departure.at} and land in {item.arrival.iataCode} at {item.arrival.at} local time.</li>
                                                )
                                            })}
                                        </ol>
                                    </Card.Header>
                                </Card>
                            </div>
                        </Collapse>
                    </Col>
                    <Col xs={3} className="border-left">
                        <h3>${props.price.total}</h3>
                        <Button>I'll take it!</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
