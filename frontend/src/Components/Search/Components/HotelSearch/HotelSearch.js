import React, { useState } from 'react'
import { FormGroup, FormControl, Button, Container } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'

import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import HotelSearchResults from './HotelSearchResults';

import SearchFilter from '../SearchFilter'

export default function HotelSearch(props) {

  const { user, getAccessTokenSilently } = useAuth0();

  const [hotelQuery, setHotelQuery] = useState("");
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelSearchResult, setHotelSearchResult] = useState([]);
  const [hotelTrips, setHotelTrips] = useState([]);

  const [filteredResults, setFilteredResults] = useState(hotelSearchResult);
  const [num, setNum] = useState(0);

  const handleSetHotelQuery = (e) => {
    e.preventDefault();
    setHotelQuery(e.currentTarget.value)
  }

  const handleSetHotelLocation = (e) => {
    e.preventDefault();
    setHotelLocation(e.currentTarget.value);
  }
  const getHotelTrips = async () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
      const token = `Bearer ${res}`;
      const api = axios.create({
        baseURL: '/api/homepage/myTrips',
        headers: {
          userid: user.sub,
          Authorization: token,
        }
      })
      try {
        api.get('/').then(response => {
          //update state trips array
          setHotelTrips(response.data);
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  const handleHotelSearch = () => {
    getHotelTrips();
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get('/api/hotel/search', {
        headers: {
          Authorization: `Bearer ${res}`,
          hotel: hotelQuery,
          location: hotelLocation,
        },
      }).then(async (res) => {
        await setHotelSearchResult(res.data);
        await setFilteredResults(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const handleFilter = filters => {
    const filtered = hotelSearchResult.filter(item => {

      if (filters.ratings === 1) {
        return item;
      }
      var isValid = true;

      if (filters.ratings > item.rating) {
        isValid = false;
      }

      if (isValid == true) {
        return item;
      }
    })

    setFilteredResults(filtered);
    setNum(num + 1);
  }

  return (
    <>
      <div className="search-bar">
        <h2>Hotel name:</h2>
        <FormGroup>
          <FormControl size='lg' onChange={handleSetHotelQuery} type="hotel-str" placeholder="Enter hotel name (optional)" />
        </FormGroup>
        <h2>Enter location here:</h2>
        <FormGroup>
          <FormControl size='lg' onChange={handleSetHotelLocation} type="location-str" placeholder="Where to?" />
        </FormGroup>
        <FormGroup className='text-right'>
          <Button className='search-btn' onClick={handleHotelSearch}>
            <BsSearch size={20} />
          </Button>
        </FormGroup>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {hotelSearchResult.length > 0 && (
          <SearchFilter ratings filterFunc={handleFilter} />
        )}
        <Container fluid>
          <HotelSearchResults
            hotelSearchResults={filteredResults}
            hotelTrips={hotelTrips}
            key={num}
          />
        </Container>
      </div>
    </>
  )
}