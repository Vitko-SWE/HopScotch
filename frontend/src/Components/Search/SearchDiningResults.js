import React, { Component, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Card, Button} from 'react-bootstrap'

const SearchDiningReseolts = (props) => {
    const {user, getAccessTokenSilently} = useAuth0();

    let results = props.items;
    console.log(results)

    var items = results.map((item, index) => {
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
        <div>
            {items}
        </div>
    )
}

export default SearchDiningReseolts