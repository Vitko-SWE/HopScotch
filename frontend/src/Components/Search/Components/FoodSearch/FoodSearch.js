import React, { useState } from 'react'
import { FormGroup, FormControl, Button, Container } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import FoodSearchResults from "./FoodSearchResults"
import SearchFilter from '../SearchFilter';
import ErrorAlert from '../../../ErrorAlert'

export default function FoodSearch(props) {

    const { user, getAccessTokenSilently } = useAuth0();
    const [foodQuery, setFoodQuery] = useState("");
    const [foodLocation, setFoodLocation] = useState("");

    const [foodSearchResult, setFoodSearchResult] = useState([])
    const [filteredResults, setFilteredResults] = useState(foodSearchResult)
    const foodTrips = useState({ items: [] });
    const [message, setMessage] = useState("")
    const [show, setShow] = useState(false)

    const [num, setNum] = useState(0)

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
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
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
                    foodTrips[1]({ items: response.data });
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
                setFoodSearchResult(res.data);
                setFilteredResults(res.data);

                if (res.data.length === 0) {
                    setMessage("Oops, it looks like we couldn't find anything for this location")
                    setShow(true)
                }
            }).catch((err) => {
                setMessage("Oops, it looks like we couldn't find anything for this location")
                setShow(true)
                console.log(err);
            });
        });
    };

    const handleFilter = filters => {
        var filtered = foodSearchResult.filter(item => {
            if (filters.minRelativePrice == 1 && filters.maxRelativePrice == 4 && filters.ratings == 1) {
                return item;
            }

            var isValid = true;

            if (item.rating < filters.ratings) {
                isValid = false;
            }

            if (item.price && item.price.length < filters.minRelativePrice) {
                isValid = false;
            }

            if (item.price && item.price.length > filters.maxRelativePrice) {
                isValid = false;
            }

            if (isValid == true) {
                return item;
            }
        })

        setFilteredResults(filtered)
        setNum(num + 1)
    }

    return (
        <div>
            <div className="search-bar">
                <h2>Search criteria:</h2>
                <FormGroup>
                    <FormControl size='lg' onChange={handleSetFoodQuery} type="dining-str" placeholder="Breakfast, Coffee, Pizza..." />
                </FormGroup>
                <h2>Enter location here:</h2>
                <FormGroup>
                    <FormControl size='lg' onChange={handleSetFoodLocation} type="location-str" placeholder="Where to?" />
                </FormGroup>
                <FormGroup className='text-right'>
                    <Button className='search-btn justify-content-right' onClick={handleFoodSearch}>
                        <BsSearch size={20} />
                    </Button>
                </FormGroup>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
                {foodSearchResult.length > 0 && (
                    <SearchFilter relativePrice ratings filterFunc={handleFilter} />
                )}
                <ErrorAlert show={show} variant="danger" text={message} closeFunc={() => setShow(false)}/>

                <Container fluid>
                    <FoodSearchResults
                        foodSearchResult={filteredResults}
                        foodTrips={foodTrips}
                        key={num}
                    />
                </Container>
            </div>
        </div>
    )
}