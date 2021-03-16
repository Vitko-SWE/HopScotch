import React, { useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Button, Form, Card} from 'react-bootstrap';
import  DisplayResults from '../Search/SearchDiningResults'
import {Link} from 'react-router-dom'
import '../Search/SearchDiningResults.css'


export default function SearchDining () {
    const {user, getAccessTokenSilently} = useAuth0();
    const searchResult = useState({items: []})
    

    const handleSearch = () => {

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/search/searchDining', {
                headers: {
                Authorization: `Bearer ${res}`,
                },
            }).then((res) => {

                searchResult[1]({items: res.data})
                // console.log(searchResult[0])
            }).catch((err) => {
                console.log(err);
            });
        });
    }





        // console.log(searchResult[0].items)
        // var items = searchResult[0].items.map((item, index) => {
            
        //     <Card style={{ width: '18rem' }}>
        //         <Card.Img variant="top" src={item.image_url} />
        //         <Card.Body>
        //             <Card.Title>Card Title</Card.Title>
        //             <Card.Text>
        //             Some quick example text to build on the card title and make up the bulk of

        //             the card's content.
        //             </Card.Text>
        //             <Button variant="primary">Go somewhere</Button>
        //         </Card.Body>
        //     </Card>
        // })

        if (searchResult[0].items.length === 0) {
            return  (
            
                <Form>
                    <Form.Group controlId="diningSearch">
                        <Form.Label>Search Dining Options</Form.Label>
                        <Form.Control type="search" placeholder="Search Dining" />
                    </Form.Group>
                    <Button onClick={handleSearch}>
                            Search
                    </Button>
                </Form>
            )
        }
        else {
            console.log("in items")
            var items = searchResult[0].items.map((item, index) => {
            
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={item.image_url} />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
    
                        the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            })
            return (
                // {console.log(searchResult[0].items)}
                <div className='card-display'>
                    {/* <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={searchResult[0].items[0].image_url} />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card> */}
                    {/* {searchResult[0].items[0].name} */}
                    {searchResult[0].items.map((item, index) => 
            
                        <Card className="custom_card" style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={item.image_url} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of

                                the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            )
        }
   


} 