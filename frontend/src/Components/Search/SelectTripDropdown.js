import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Dropdown, DropdownButton } from 'react-bootstrap'
export default function SelectTripDropdown(props) {
    const {user, getAccessTokenSilently} = useAuth0();
    const trips = useState({items: []});
    
    const handleSelect = (item) => {
        console.log(item.TripId)

        const newFeature = {
            FeatureId: props.diningOption.id,
            FeatureType: "Dining",
            TripId: item.TripId
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.post('/api/search/selectDining', newFeature, {
                headers: {
                Authorization: `Bearer ${res}`,
                },
            }).then((res) => {
                alert("The dining option has been added to your trip!")
            }).catch((err) => {
                console.log(err);
            });
        });

    }

    return (
        <DropdownButton id="dropdown-item-button" title="Select">
            <Dropdown.Header>Add dining to trip</Dropdown.Header>
            {props.trips.map((item) => (
                   <Dropdown.Item onClick={() => handleSelect(item)} as="button">{item.Name}</Dropdown.Item>
                ))}
        </DropdownButton>
    );
  }