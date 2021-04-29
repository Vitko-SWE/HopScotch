import React from 'react'
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function FlightCard_SegmentStatistics(props) {

    const { user, getAccessTokenSilently } = useAuth0();

    const getFlightStatistics = () => {
        console.log(props.carrierCode);
    }
    return (
        <div>
            <p>Statistics for {props.carrierCode}{props.flightNumber}:</p>
            {() => getFlightStatistics()}
        </div>)
}