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
      sepTrips: {
        owned: [],
        shared: [],
      },
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
          let tempTrips = response.data;
          tempTrips = tempTrips.sort((a, b) => new Date(...a.StartDate.split('/').reverse()) - new Date(...b.StartDate.split('/').reverse()));

          let promises = [];
          for (let i = 0; i < tempTrips.length; i++) {
            promises.push(
              axios.get(`/api/trips/getuserrole/${tempTrips[i].TripId}/${this.state.user_object.user.sub}`, {
                headers: {
                  Authorization: `Bearer ${res}`,
                },
              }).then((res) => {
                const curr = res.data[0].Role;

                if (curr === "Owner") {
                  this.state.sepTrips.owned.push(tempTrips[i]);
                  this.setState(this.state);
                }
                else {
                  this.state.sepTrips.shared.push(tempTrips[i]);
                  this.setState(this.state);
                }
              }).catch((err) => {
                console.log(err);
              })
            );
          }
        })
      } catch (err) {
        console.log(err)
      }
    })
  }

  render() {
    let ownedTrips = null;
    let sharedTrips = null;

    if (this.state.sepTrips.owned.length === 0) {
      ownedTrips = (<h1>You do not own any trips at this moment.</h1>);
    }
    else {
      ownedTrips = (
        <div className="custom_container">
          {this.state.sepTrips.owned.map((trip, index) => (
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
          ))}
        </div>
      );
    }
    if (this.state.sepTrips.shared.length === 0) {
      sharedTrips = (<h1>You do not have any trips shared with you at this moment.</h1>);
    }
    else {
      sharedTrips = (
        <div className="custom_container">
          {this.state.sepTrips.shared.map((trip, index) => (
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
          ))}
        </div>
      );
    }

    return (
      <div>
        <h1>Trips Owned by You</h1>
        {ownedTrips}
        <hr />
        <h1>Trips Shared with You</h1>
        {sharedTrips}
      </div>
    );
  }
}

export default withAuth0(TripCards)
