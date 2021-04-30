import React, { useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Button, Form, Card, ListGroup, ListGroupItem, InputGroup, FormControl, Alert} from 'react-bootstrap';
import '../Search/SearchDiningResults.css'
import { FaYelp } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs'
import Rating from './Rating'
import SelectTripDropdown from './SelectTripDropdown'
import ErrorAlert from '../ErrorAlert'




export default function SearchDining () {
    const {user, getAccessTokenSilently} = useAuth0();
    const searchResult = useState({items: []})
    const trips = useState({items: []});
    const [dining, setDining] = useState("")
    const [location, setLocation] = useState("")
    const [message, setMessage] = useState("")
    const [show, setShow] = useState(false)

    

    const handleSearch = () => {
        getTrips();
        
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/search/searchDining', {
                headers: {
                Authorization: `Bearer ${res}`,
                string: dining,
                city: location,
                },
            }).then((res) => {
                //update state of searchResult
                searchResult[1]({items: res.data})
                
                if (res.data.length === 0) {
                    // alert("Oops, it looks like we couldn't find anything for this location");
                    setMessage("Oops, it looks like we couldn't find anything for this location")
                    setShow(true)
                }
            }).catch((err) => {
                console.log(err);
                // alert("Oops, it looks like we couldn't find anything for this location");
                setMessage("Oops, it looks like we couldn't find anything for this location")
                setShow(true)
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
                trips[1]({items: response.data})
            })
          } catch (err) {
            console.log(err)
          }
        })
      }

    const handleLocationChange = (e) => {
        e.preventDefault()
        setLocation(e.currentTarget.value)
    }

    const handleDiningChange = (e) => {
        e.preventDefault()
        setDining(e.currentTarget.value)
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
                <ErrorAlert show={show} variant="danger" text={message} closeFunc={() => setShow(false)}/> 
            </div>
        )
    }
    else {
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
                        <Card className="custom_card" style={{ width: '19%' }}>
                            <Card.Img style={{width: '100%', height: '280px'}} variant="top" src={item.image_url} />
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
                                <SelectTripDropdown trips={trips[0].items} diningOption={item}/>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>
        )
    }
   


} 