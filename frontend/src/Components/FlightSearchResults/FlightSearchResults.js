import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import FlightCard from './components/FlightCard'

export default function FlightSearchResults(props) {
    const {state} = props.location
    const { user, getAccessTokenSilently } = useAuth0();
    const [trips, setTrips] = useState([]);

    useLayoutEffect(() => {
        if(trips.length == 0) {
            getUserTrips();
        }
    });

    const getUserTrips = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/homepage/myTrips', {
                headers: {
                    Authorization: `Bearer ${res}`,
                    userid: user.sub
                }
            }).then((res) => {
                setTrips(res.data)
                console.log("RES")
                console.log(res)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                console.log("is this working?")
            })
        }).catch(err => {
            console.log(err)
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
                        data={item}
                    />
                )
            })}
        </div>
    )
}
