import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../TripCard/Card.css"
import pic from '../TripCard/canada_banff.jpg'
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react";



const MyTrips = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    let trips = [{
        Name: "Banff",
        trip_owner: "dudson"
    }]

    console.log(user)

    getAccessTokenSilently({
        audience: "https://hopscotch/api"

    }).then(res => {

        var authorization = `Bearer ${res}`

            // "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI2WXUzbjRKOEVvNnFWU2EyRk9YNSJ9.eyJpc3MiOiJodHRwczovL2ZseWhvcHNjb3RjaC1kZXYudXMuYXV0aDAuY29tLyIsInN1YiI6IkVIenljdVBVbm9vQzNnOVF6UDZoNnlaYjhiZkNqNTJGQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2hvcHNjb3RjaC9hcGkiLCJpYXQiOjE2MTM5NjY0NTIsImV4cCI6MTYxNDA1Mjg1MiwiYXpwIjoiRUh6eWN1UFVub29DM2c5UXpQNmg2eVpiOGJmQ2o1MkYiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.TT3ftAJBPuU3z-58E8GHgEQrOFj3MW3wopDpeo9IlkWMGzvO4_l-OFeT7Ztap4bRnraf03yYZJLQY7UhO0-EKTNAksiU0BACIaXXiviE0O5w8mHnuGsbsm8dEXpM78O9BG5CUuRjXC98mOeM6NKnbW3XnR4G44lBBV5KOvMNBvEld5nZQeFOYeaNxfghO0m0WiA4PaVWss78moLI09hSdxKALCLOzxN9wTtYBdmxGVvc1bsD1JCvVG3IPIFy1EOQK95ZeovrAxrFy6SZJzcyh6-UquDakKaSCBi3pAc848cCLltTQAVOfXCXvT4Og9MDuzH20KxXfPndEHc1AnCJng"
        console.log("==== " + res)

        const api = axios.create({
            baseURL: 'http://localhost:5000/homepage/myTrips',
            headers: {
            userid: user.sub, 
            Authorization: authorization
            }
        })

        try {
            let data = api.get('/').then(({data}) => data)
            console.log(data)
            trips = data.data
        } catch (err) {
            console.log(err)
            trips = []
        }
    })

    console.log(trips)

    if (trips != null && trips.length !== 0) {
        return (
            <div className="custom_container">
              {trips.map((trip, index) =>
                <Card className="custom_card">
                  <Card.Img variant="top" src={pic} />
                  <Card.Body>
                    <Card.Title>{trip.Name}</Card.Title>
                    <Card.Text>
                      Days Remaining: 365
                    </Card.Text>
                    <Card.Text>
                      Trip Organizer: {trip.trip_owner}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                    <Button  variant="primary" size="lg" block>Edit</Button>
                    <Button  variant="danger" size="lg" block>Exit Trip</Button>
                    </small>
                  </Card.Footer>
                </Card>
              )}
            </div>
          )
    
    }
    else {
        return (
            <h1>You do not have any trips at this moment</h1>
        )
    }




}


export default MyTrips