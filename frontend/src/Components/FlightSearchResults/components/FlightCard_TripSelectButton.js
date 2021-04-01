import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useHistory } from 'react-router';

export default function FlightCard_TripSelectButton(props) {
    const [buttonTrips, setButtonTrips] = useState(props.trips);
    const { user, getAccessTokenSilently } = useAuth0();
    const history = useHistory();

    useLayoutEffect(() => { setButtonTrips(props.trips) }, [props.trips])

    const handleClick = item => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
            const authToken = res;
            axios.post(`/api/search/selectFlight`, {
                FlightData: btoa(JSON.stringify(props.trip)),
                TripId: item.TripId,
                Price: props.price,
                Airline: props.airline,
                Origin: props.origin,
                Destination: props.destination,
                User: user.sub
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }).then(res => {
                //TODO: get feature id
                if (res.status == 200) {
                    axios.post("/api/trips/vote", {
                        tripid: item.TripId,
                        userid: user.sub,
                        featureid: res.data.insertId,
                        isflight: 1,
                        score: 1
                    }, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }).then(res => {
                        history.push({
                            pathname: `/edittrip/${item.TripId}`
                        });
                    }).catch(err => {
                        console.log(err)
                        alert("error")
                    })
                } else {
                    alert("error")
                }
            }).catch(err => {
                console.log(err)
                alert("Error")
            })
        }).catch(err => {
            console.log(err)
            alert("error")
        })
    }

    return (
        <DropdownButton title="Select">
            <Dropdown.Header>Add this flight to a trip:</Dropdown.Header>
            {buttonTrips.length >= 0 && buttonTrips.map((item, i) => {
                return (
                    <Dropdown.Item key={item.TripId} onClick={() => handleClick(item)} as="button">{item.Name}</Dropdown.Item>
                )
            })}
        </DropdownButton>
    )
}
