import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../TripCard/Card.css"
import pic from '../TripCard/canada_banff.jpg'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/homepage/myTrips',
  headers: {
    userID: "1"
  }
})
class TripCards extends Component {

  state = {
    trips:  [] 
  }

  constructor(props) {
    super (props);
    this.state = {
      trips:  []
    }
    this.getTrips = this.getTrips.bind(this)


  }
  
  componentDidMount () {
    this.getTrips()
  }


  getTrips = async () => {
    try {
      let data = await api.get('/').then(({data}) => data)
      console.log(data)
      this.setState({trips: data})
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    let my_trips = <h1>You do not have any trips at this moment</h1>

    if (this.state.trips.length > 0) {
      my_trips = (
        <div className="custom_container">
          {this.state.trips.map((trip, index) =>
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
    console.log(this.state.trips)
    return (
      <div>
        {my_trips}
      </div>
  
    )
  }
}

export default TripCards
