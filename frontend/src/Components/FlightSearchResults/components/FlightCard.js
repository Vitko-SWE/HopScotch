import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Row, Col, Container, Button, Collapse, Card, Image } from 'react-bootstrap'
import FlightCard_SegmentDetails from './FlightCard_SegmentDetails';
import FlightCard_TripSelectButton from './FlightCard_TripSelectButton';
const airlines = require('../airlines.json')

export default function FlightCard(props) {
    const [deptOpen, setDeptOpen] = useState(false);
    const [retOpen, setRetOpen] = useState(false);
    const [buttonTrips, setButtonTrips] = useState(props.trips);

    useEffect(() => { setButtonTrips(props.trips) }, [props.trips])

    // console.log(props)

    return (
        <div>
            <Container fluid className="border p-3 rounded">
                <Row>
                    <Col xs={2} className="border-right">
                        {props.airlines.map((item, i) => {
                            return(
                                <div key={i}>
                                    <Image src={`/static/airlinelogos/${item}.png`} rounded fluid/>
                                    <h5>{airlines.find(x => x.code == item).name}</h5>
                                </div>
                            )
                        })}
                    </Col>
                    <Col>
                        <Button variant="outline-dark" className="mb-2" block onClick={() => setDeptOpen(!deptOpen)}>
                            Departure Flight | {props.itineraries[0].duration.substring(2).toLowerCase()} | {props.itineraries[0].segments.length - 1} Stops
                        </Button>
                        <Collapse in={deptOpen} className="mb-2">
                            <div>
                                <FlightCard_SegmentDetails segment={props.itineraries[0].segments} />
                            </div>
                        </Collapse>

                        <Button variant="outline-dark" className="mb-2" block onClick={() => setRetOpen(!retOpen)}>
                            Return Flight | {props.itineraries[1].duration.substring(2).toLowerCase()} | {props.itineraries[1].segments.length - 1} Stops
                        </Button>
                        <Collapse in={retOpen}>
                            <div>
                                <FlightCard_SegmentDetails segment={props.itineraries[1].segments} />
                            </div>
                        </Collapse>
                    </Col>
                    <Col xs={3} className="border-left">
                        <h3>${props.price.total}</h3>
                        {buttonTrips.length > 0 &&
                            <FlightCard_TripSelectButton 
                                key={buttonTrips.length} 
                                trips={buttonTrips} 
                                trip={props.data}
                                price={props.price.total}
                                airline={props.airlines[0]}
                                origin={props.itineraries[0].segments[0].departure.iataCode}
                                destination={props.itineraries[1].segments[0].departure.iataCode}
                            />
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
