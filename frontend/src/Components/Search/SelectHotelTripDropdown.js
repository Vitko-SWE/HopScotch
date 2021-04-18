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
            FeatureId: props.hotelOption.place_id,
            FeatureType: "Hotel",
            TripId: item.TripId,
            BookingUrl: props.hotelOption.website,
            FeatureName: props.hotelOption.name,
            Address: props.hotelOption.formatted_address
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.post('/api/hotel/selectHotel', newFeature, {
                headers: {
                Authorization: `Bearer ${res}`,
                },
            }).then((res) => {
              alert("The hotel has been added to the selected trip.");
            }).catch((err) => {
                console.log(err);
            });
        });

    }

    return (
        <DropdownButton id="dropdown-item-button" title="Select Trip to add to">
            <Dropdown.Header>Add hotel to trip</Dropdown.Header>
            {props.trips.map((item) => (
                !item.IsLocked ?
                   <div><Dropdown.Item onClick={() => handleSelect(item)} as="button">{item.Name}</Dropdown.Item></div> :
                   <div><Dropdown.Item disabled>{item.Name}</Dropdown.Item></div>
                ))}
        </DropdownButton>
    );
  }
