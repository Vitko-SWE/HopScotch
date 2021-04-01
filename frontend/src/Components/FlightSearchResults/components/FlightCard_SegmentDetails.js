import React from 'react'
import { Card } from 'react-bootstrap'

export default function FlightCard_SegmentDetails(props) {
    return (
        <div>
            <Card>
                <Card.Header>
                    <Card.Title>Flight Details</Card.Title>
                    <ol>
                        {props.segment.map((item, i) => {
                            return (
                                <li key={item.id}>Depart {item.departure.iataCode} at {item.departure.at} and land in {item.arrival.iataCode} at {item.arrival.at} local time.</li>
                            )
                        })}
                    </ol>
                </Card.Header>
            </Card>
        </div>
    )
}
