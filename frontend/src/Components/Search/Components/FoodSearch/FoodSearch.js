import React, {useState} from 'react'
import {FormGroup, FormControl, Button} from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import FoodSearchResults from "./FoodSearchResults"

export default function FoodSearch(props) {

    const { user, getAccessTokenSilently } = useAuth0();
    const [foodQuery, setFoodQuery] = useState("");
    const [foodLocation, setFoodLocation] = useState("");

    const foodSearchResult = useState({items: []})
    const foodTrips = useState({items: []});

    const handleSetFoodQuery = (e) => {
        e.preventDefault();
        setFoodQuery(e.currentTarget.value)
    }

    const handleSetFoodLocation = (e) => {
        e.preventDefault();
        setFoodLocation(e.currentTarget.value);
    }

      // Food Functions
    const getFoodTrips = async () => {
        getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
        const token = `Bearer ${res}`;
        const api = axios.create({
            baseURL: '/api/homepage/myTrips',
            headers: {
            userid: user.sub,
            Authorization: token
            }
        });
        try {
            api.get('/').then(response => {
            foodTrips[1]({items: response.data});
            });
        } catch (err) {
            console.log(err);
        }
        });
    };
    const handleFoodSearch = () => {
        getFoodTrips();
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.get('/api/search/searchDining', {
            headers: {
            Authorization: `Bearer ${res}`,
            string: foodQuery,
            city: foodLocation,
            },
        }).then((res) => {
            foodSearchResult[1]({items: res.data});

            if (res.data.length === 0) {
            alert("Oops, it looks like we couldn't find anything for this location");
            }
        }).catch((err) => {
            console.log(err);
            alert("Oops, it looks like we couldn't find anything for this location");
        });
        });
    };

    return (
        <div>
            <div className="search-bar">
                <h2>Search criteria:</h2>
                <FormGroup>
                    <FormControl size='lg' onChange={handleSetFoodQuery} type="dining-str" placeholder="Breakfast, Coffee, Pizza..."/>
                </FormGroup>
                <h2>Enter location here:</h2>
                <FormGroup>
                    <FormControl size='lg' onChange={handleSetFoodLocation} type="location-str" placeholder="Where to?"/>
                </FormGroup>
                <FormGroup className='text-right'>
                    <Button className='search-btn justify-content-right' onClick={handleFoodSearch}>
                        <BsSearch size={20} />
                    </Button>
                </FormGroup>
            </div>
            <div>
                <FoodSearchResults
                    foodSearchResult = {foodSearchResult}
                    foodTrips = {foodTrips}
                />
            </div>
        </div>
    )
} 