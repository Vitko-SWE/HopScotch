import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import FlightCard from './components/FlightCard'

export default function FlightSearchResults(props) {
    const {state} = props.location
    const { user, getAccessTokenSilently } = useAuth0();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        getUserTrips();
    });

    const getUserTrips = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/homepage/myTrips', {
                headers: {
                    Authorization: `Bearer ${res}`
                }
            }).then((res) => {
                setTrips(res.data)
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    return (
        <div>
            {state.data.data.map((item, i) => {
                return(
                    <FlightCard key={item.id} 
                        itineraries={item.itineraries} 
                        price={item.price} 
                        airlines={item.validatingAirlineCodes}
                        trips={trips}
                    />
                )
            })}
        </div>
    )
}
