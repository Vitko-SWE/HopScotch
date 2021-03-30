import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap';

export default function FlightCard_TripSelectButton(props) {
    // console.log("PROPS")
    // console.log(props)

    const handleClick = item => {
        item.preventDefaults();

        const newFeature = {
            FeatureId: btoa(JSON.stringify(props.trip))
        }
    }

    return (
        <DropdownButton title="Select">
            <Dropdown.Header>Add this flight to a trip:</Dropdown.Header>
            {props.trips.length >= 0 && props.trips.map((item) => {
                <Dropdown.Item onClick={() => handleClick(item)} as="button">{item.Name}</Dropdown.Item>
            })}
        </DropdownButton>
    )
}
