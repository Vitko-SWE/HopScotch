import React, { useState }from 'react'
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner } from 'react-bootstrap';

export default function FlightCard_SegmentStatistics(props) {

    const { user, getAccessTokenSilently } = useAuth0();
    const [ isFlightStatisticsLoaded, setIsFlightStatisticsLoaded ] = useState(false);
    const [ isThereFlightInfo, setIsThereFlightInfo] = useState(false);
    const [ percentDelayed, setPercentDelayed] = useState(0);
    const [ percentCancelled, setPercentCancelled] = useState(0);
    const [ percentDiverted, setPercentDiverted ] = useState(0);

    const getFlightInfo = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get(`/api/flights/getflightinfo/${props.carrierCode}/${props.flightNumber}`, {
                headers: {
                    Authorization: `Bearer ${res}`,
                },
            }).then((res) => {
                console.log(res.data);
                
                setPercentDelayed(res.data.numDelayed / res.data.totalFlights);
                setPercentCancelled(res.data.numCancelled / res.data.totalFlights);
                setPercentDiverted(res.data.numDiverted / res.data.totalFlights);
                setIsFlightStatisticsLoaded(true);
                setIsThereFlightInfo(true);
    
            }).catch(err => {
                setIsFlightStatisticsLoaded(true);
                setIsThereFlightInfo(false);
            })
        })
    }


    return (
        <>
            {(isFlightStatisticsLoaded && isThereFlightInfo) && (
                <div style={{ border: '1px solid black', borderRadius: '5px' }}> 
                    <p>Statistics for {props.carrierCode}{props.flightNumber}:</p>
                    <p>Percent delayed: {percentDelayed.toFixed(2)}%</p>
                    <p>Percent cancelled: {percentCancelled.toFixed(2)}%</p>
                    <p>Percent diverted: {percentDiverted.toFixed(2)}%</p>
                </div>
            )}
            {(isFlightStatisticsLoaded && !isThereFlightInfo) && (
                <p>No data found for {props.carrierCode}{props.flightNumber}</p>
            )}
            {!isFlightStatisticsLoaded && (
                <div>
                    {getFlightInfo()}
                    <Spinner animation="border" role="status" className="mt-3"/>
                </div>

            )}
        </>
    )
}