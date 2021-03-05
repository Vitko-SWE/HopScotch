import React, { Component, useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../TripCard/Card.css"
import pic from '../TripCard/canada_banff.jpg'
import axios from 'axios'
import { withAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

class TripCards extends Component {

  constructor(props) {
    super (props);
    this.state = {
      trips:  [],
      user_object: this.props.auth0
    }
    this.getTrips = this.getTrips.bind(this)


  }

  componentDidMount () {
    this.getTrips()
  }


  getTrips = async () => {
    this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
      const token = `Bearer ${res}`


      // console.log("tk ==== " + token)
      const api = axios.create({
        baseURL: '/api/homepage/myTrips',
        headers: {
          userid: this.state.user_object.user.sub,
          Authorization: token
        }
      })

      try {
        api.get('/').then(response => {
          this.setState({trips: response.data})
          let sortedTrips = this.state.trips.sort((a, b) => new Date(...a.StartDate.split('/').reverse()) - new Date(...b.StartDate.split('/').reverse()));
          this.setState(({trips: sortedTrips}))
        })
      } catch (err) {
        console.log(err)
      }
    })
  }

  render() {
    let my_trips = null

    my_trips = (
      <div className="custom_container">
        {this.state.trips.map((trip, index) =>
          <Card className="custom_card">
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>{trip.Name}</Card.Title>
              <Card.Text>
                Start Date: {new Intl.DateTimeFormat('en-US').format(new Date(trip.StartDate))}
              </Card.Text>
              <Card.Text>
                End Date: {new Intl.DateTimeFormat('en-US').format(new Date(trip.EndDate))}
              </Card.Text>
              <Card.Text>
                Days Remaining: {Math.ceil((new Date(trip.StartDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to={`/edittrip/${trip.TripId}`}><Button className="edit-button"  variant="primary" size="lg" block>Edit</Button></Link>
              <Button  variant="danger" size="lg" block>Exit Trip</Button>
            </Card.Footer>
          </Card>
        )}
      </div>
    )

    if (this.state.trips.length === 0) {
      my_trips = <h1>You do not have any trips at this moment</h1>
    }

    return (
      <div>
        {my_trips}
      </div>

    )
  }
}

export default withAuth0(TripCards)
