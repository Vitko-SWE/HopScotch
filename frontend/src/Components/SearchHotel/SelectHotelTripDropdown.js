import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useHistory } from 'react-router';

export default function SelectTripDropdown(props) {

    const {user, getAccessTokenSilently} = useAuth0();
    const trips = useState({items: []});
    const history = useHistory();

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
            const authToken = res;
            axios.post('/api/hotel/selectHotel', newFeature, {
                headers: {
                Authorization: `Bearer ${authToken}`,
                },
            }).then((res2) => {
                console.log(res2.data);
                axios.post("/api/trips/vote", {
                    tripid: item.TripId,
                    userid: user.sub,
                    featureid: props.hotelOption.place_id,
                    isflight: 0,
                    score: 1
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }).then(res3 => {
                    history.push({
                        pathname: `/edittrip/${item.TripId}`
                    });
                }).catch((err) =>{
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });

    }

    return (
        <DropdownButton id="dropdown-item-button" title="Select Trip to add to">
            <Dropdown.Header>Add hotel to trip</Dropdown.Header>
            {props.trips.map((item) => (
                   <Dropdown.Item onClick={() => handleSelect(item)} as="button">{item.Name}</Dropdown.Item>
                ))}
        </DropdownButton>
    );
  }
