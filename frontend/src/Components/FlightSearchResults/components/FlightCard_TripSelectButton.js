import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export default function FlightCard_TripSelectButton(props) {
    const [buttonTrips, setButtonTrips] = useState(props.trips);
    const { user, getAccessTokenSilently } = useAuth0();
    const history = useHistory();

    useLayoutEffect(() => { setButtonTrips(props.trips) }, [props.trips])

    const handleClick = item => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
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
                    Authorization: `Bearer ${res}`
                }
            }).then(res => {
                if (res.status == 200) {
                    alert("Success!")
                    history.push({
                        pathname: `/edittrip/${item.TripId}`,
                        state: {
                            data: flightData,
                            trips: res.data
                        }
                    });
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
