import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../TripCard/Card.css"
import pic from '../TripCard/canada_banff.jpg'
import axios from 'axios'
import { withAuth0 } from "@auth0/auth0-react";
import MyTrips from '../TripCard/MyTrips'



class TripCards extends Component {


  constructor(props) {
    super (props);
    this.state = {
      trips:  [],
      user_object: this.props.auth0
    }
    this.getTrips = this.getTrips.bind(this)


  }
  
  // componentDidMount () {
  //   this.getTrips()
  // }


  getTrips = async () => {
    const api = axios.create({
      baseURL: 'http://localhost:5000/homepage/myTrips',
      headers: {
        userID: this.state.user_object.user.sub
      }
    })

    try {
      let data = await api.get('/').then(({data}) => data)
      console.log(data)
      this.setState({trips: data})
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    // let my_trips = null

    // my_trips = (
    //   <div className="custom_container">
    //     {this.state.trips.map((trip, index) =>
    //       <Card className="custom_card">
    //         <Card.Img variant="top" src={pic} />
    //         <Card.Body>
    //           <Card.Title>{trip.Name}</Card.Title>
    //           <Card.Text>
    //             Days Remaining: 365
    //           </Card.Text>
    //           <Card.Text>
    //             Trip Organizer: {trip.trip_owner}
    //           </Card.Text>
    //         </Card.Body>
    //         <Card.Footer>
    //           <small className="text-muted">
    //           <Button  variant="primary" size="lg" block>Edit</Button>
    //           <Button  variant="danger" size="lg" block>Exit Trip</Button>
    //           </small>
    //         </Card.Footer>
    //       </Card>
    //     )}
    //   </div>
    // )

    // if (this.state.trips.length === 0) {
    //   console.log("trips == 0")
    //   my_trips = <h1>You do not have any trips at this moment</h1>
    // }
    
    // console.log(this.state.trips)
    return (
      <div>
        <MyTrips/>
      </div>
  
    )
  }
}

export default withAuth0(TripCards)
