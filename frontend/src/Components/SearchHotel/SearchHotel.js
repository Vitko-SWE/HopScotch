import React, {useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { FormControl, InputGroup, Button, Card, CardColumns } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs'
import axios from 'axios'
import SelectHotelTripDropdown from '../Search/SelectHotelTripDropdown'

import '../SearchHotel/SearchHotel.css'

export default function SearchHotel() {
    const {user, getAccessTokenSilently} = useAuth0();
    const [hotelSearchResult, setHotelSearchResult] = useState([]);
    const [trips, setTrips] = useState([]);
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
        getTrips();
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/hotel/search', {
                headers: {
                Authorization: `Bearer ${res}`,
                hotel: hotel,
                location: hotelLocation,
                },
            }).then(async (res) => {
                await setHotelSearchResult(res.data);
                console.log(hotelSearchResult)
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    const getTrips = async () => {
        getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
          const token = `Bearer ${res}`
          const api = axios.create({
            baseURL: '/api/homepage/myTrips',
            headers: {
              userid: user.sub,
              Authorization: token
            }
          })
    
          try {
            api.get('/').then(response => {
                //update state trips array
                setTrips(response.data);
            })
          } catch (err) {
            console.log(err)
          }
        })
      }
    return (
        <div>
            <div className="search-bar">
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Find Hotels</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onChange={handleHotelChange} type="hotel-str" placeholder="Hotel name (optional)"/>
                    <FormControl onChange={handleLocationChange} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
                    <InputGroup.Append>
                        <Button className='search-btn' onClick={handleSearch}>
                                <BsSearch size={20} />
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
            {hotelSearchResult.length > 0 &&
            <div className='card-display'>
                {hotelSearchResult.map((item, index) => 
                <Card className="custom_card" style={{ width: '19%' }}>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                            Rating: {item.rating}/5
                        </Card.Text>
                        <Card.Text>Address: {item.formatted_address}</Card.Text>
                        <a href={item.url} className="btn btn-primary">Visit on google maps</a>
                        <h1></h1>
                        <a href={item.website} className="btn btn-primary">Visit hotel's website</a>
                        <h1></h1>
                        <SelectHotelTripDropdown trips={trips} hotelOption={item}/>
                    </Card.Body>
                </Card>
                )} 
            </div>
            }
        </div>
    );
}