import React from 'react'
import { Card } from 'react-bootstrap'

import SegmentStatistics from './FlightCard_SegmentStatistics'

export default function FlightCard_SegmentDetails(props) {

    

    return (
        <div>
            <Card>
                <Card.Header>
                    <Card.Title>Flight Details and Statistics:</Card.Title>
                    <ol>
                        {props.segment.map((item, i) => {
                            return (
                                <li key={item.id}>Depart {item.departure.iataCode} at {item.departure.at} on {item.carrierCode}{item.number} and land at {item.arrival.iataCode} at {item.arrival.at} local time
                                <SegmentStatistics carrierCode = {item.carrierCode} flightNumber = {item.number}/>
                                </li>
                            )  
                        })}
                    </ol>
                    <p>*All flight statistics are provided by the BTS and range from June to December of 2019</p>
                </Card.Header>
            </Card>
        </div>
    )
}
