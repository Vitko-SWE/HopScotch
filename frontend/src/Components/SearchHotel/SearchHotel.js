import React, { useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs'
import axios from 'axios'


export default function SearchHotel() {
    const {user, getAccessTokenSilently} = useAuth0();
    const hotelSearchResult = useState({items: []});
    const [hotel, setHotel] = useState("");
    const [hotelLocation, setHotelLocation] = useState("");

    const handleLocationChange = (e) => {
        e.preventDefault()
        setHotelLocation(e.currentTarget.value)
    }

    const handleHotelChange = (e) => {
        e.preventDefault()
        setHotel(e.currentTarget.value)
    }

    const handleSearch = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/hotel/search', {
                headers: {
                Authorization: `Bearer ${res}`,
                hotel: hotel,
                location: hotelLocation,
                },
            }).then((res2) => {
                console.log(res2);
            }).catch((err) => {
                console.log(err);
            });
        });
        
    }


    return  (
        <div className="search-bar">
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Find Hotels</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={handleHotelChange} type="hotel-str" placeholder="Hotel name"/>
                <FormControl onChange={handleLocationChange} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
                <InputGroup.Append>
                    <Button className='search-btn' onClick={handleSearch}>
                            <BsSearch size={20} />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )

}