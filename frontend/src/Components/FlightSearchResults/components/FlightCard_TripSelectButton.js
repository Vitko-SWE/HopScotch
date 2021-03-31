import React from 'react'
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export default function FlightCard_TripSelectButton(props) {
    const [buttonTrips, setButtonTrips] = useState(props.trips);

    useLayoutEffect(() => { setButtonTrips(props.trips) }, [props.trips])

    const handleClick = item => {
        item.preventDefaults();

        const newFeature = {
            FeatureId: btoa(JSON.stringify(props.trip))
        }
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
