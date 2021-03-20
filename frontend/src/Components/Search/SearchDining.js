import React, { useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Button, Form, Card, ListGroup, ListGroupItem, InputGroup, FormControl} from 'react-bootstrap';
import '../Search/SearchDiningResults.css'
import { FaYelp } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs'
import Rating from './Rating'




export default function SearchDining () {
    const {user, getAccessTokenSilently} = useAuth0();
    const searchResult = useState({items: []})
    const [searchString, setSearchString] = useState("")
    const [dining, setDining] = useState("")
    const [location, setLocation] = useState("")
    

    const handleSearch = () => {
        console.log(searchString)

        var str = searchString.split(",")
        console.log(str)

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/search/searchDining', {
                headers: {
                Authorization: `Bearer ${res}`,
                string: dining,
                city: location,
                },
            }).then((res) => {

                searchResult[1]({items: res.data})
                // console.log(searchResult[0])
            }).catch((err) => {
                console.log(err);
            });
        });
    }


    // const handleSearchChange = (e) => {
    //     e.preventDefault()
    //     setSearchString(e.currentTarget.value)
    // }

    const handleLocationChange = (e) => {
        e.preventDefault()
        setLocation(e.currentTarget.value)
    }

    const handleDiningChange = (e) => {
        e.preventDefault()
        setDining(e.currentTarget.value)
    }


    const handleSelect = (item_id) => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.post('/api/search/selectDining', {
                headers: {
                Authorization: `Bearer ${res}`,
                ited_ID: item_id
                },
            }).then((res) => {
            }).catch((err) => {
                console.log(err);
            });
        });
    }


    if (searchResult[0].items.length === 0) {
        return  (
            <div className="search-bar">
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Find</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onChange={handleDiningChange} type="dining-str" placeholder="Breakfast, Coffee, Pizza..."/>
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
    else {
        console.log("in items")
        return (
            <div>
                <div className="search-bar">
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Find</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={handleDiningChange} type="dining-str" placeholder="Breakfast, Coffee, Pizza..."/>
                        <FormControl onChange={handleLocationChange} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
                        <InputGroup.Append>
                            <Button className='search-btn' onClick={handleSearch}>
                                    <BsSearch size={20} />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div className='card-display'>
                    {searchResult[0].items.map((item, index) => 
                        <Card className="custom_card" style={{ width: '18rem' }}>
                            <Card.Img style={{width: '17.9rem', height: '280px'}} variant="top" src={item.image_url} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    <Rating rating={item.rating}/>
                                    <Card.Text className="text-muted">{item.review_count} reviews</Card.Text>
                                </Card.Text>
                                <Card.Text>Price: {item.price}</Card.Text>
                                <Card.Text>{item.location.address1}, {item.location.city}, {item.location.state}</Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Body>
                                    <a href={item.url}>
                                            <FaYelp size={50} style={{fill: 'red' }} />
                                    </a>
                                    <h1>Yelp</h1>
                                    <p>Read more on Yelp</p>
                                </Card.Body>
                                <Button variant="primary">Select</Button> 
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>
        )
    }
   


} 