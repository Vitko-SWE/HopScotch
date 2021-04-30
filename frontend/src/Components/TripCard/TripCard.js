import React, { Component, useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../TripCard/Card.css"
import pic from '../TripCard/canada_banff.jpg'
import axios from 'axios'
import { withAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';
import { CardColumns, Dropdown, Spinner} from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';

class TripCards extends Component {

  constructor(props) {
    super (props);
    this.state = {
      sepTrips: {
        owned: [],
        shared: [],
      },
      user_object: this.props.auth0,
      loading: true,
      noTripsOwned: true,
      noTripsShared: true,
    }
    this.getTrips = this.getTrips.bind(this)
    this.displayOwnedTrips = this.displayOwnedTrips.bind(this)
    this.displaySharedTrips = this.displaySharedTrips.bind(this)
  }

  componentDidMount () {
    this.getTrips()
  }


  getTrips = async ()  => {
    let accessToken = null
    accessToken = await this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"})
    const token = `Bearer ${accessToken}`
    let res = null

    res = await axios.get(`/api/trips/getuserrole/${this.state.user_object.user.sub}`, {
      headers: {
        Authorization: token,
      }
    })

    let roles = res.data
    roles = roles.sort((a, b) => a.TripId > b.TripId ? 1 : -1);

    res = await axios.get(`/api/homepage/myTrips`, {
      headers: {
        Authorization: token,
        userid: this.state.user_object.user.sub,
      }
    })

    let trips = res.data
    trips= trips.sort((a, b) => a.TripId > b.TripId ? 1 : -1);

    for (let i = 0; i < trips.length; i++) {
      const curr = trips[i];
      let accessToken1 = await this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"});
      const token = `Bearer ${accessToken1}`;
      let currimg = await axios.get(`/api/trips/gettripimage/${curr.TripId}`, {
        headers: {
          Authorization: token,
        }
      });
      currimg = currimg.data;
      trips[i].ImgUrl = currimg;
    }

    let ownedTrips = []
    let sharedTrips = []

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].Role === "Owner") {
        ownedTrips.push(trips[i])
      }
      else {
        sharedTrips.push(trips[i])
      }
    }

    ownedTrips = ownedTrips.sort((a, b) => new Date(...a.StartDate.split('/').reverse()) - new Date(...b.StartDate.split('/').reverse()));
    sharedTrips = sharedTrips.sort((a, b) => new Date(...a.StartDate.split('/').reverse()) - new Date(...b.StartDate.split('/').reverse()));


    let myTrips = {
      owned: ownedTrips,
      shared: sharedTrips
    }
    this.setState({sepTrips: myTrips})

    if (ownedTrips.length !== 0) {
      this.setState({noTripsOwned: false})
    }

    if (sharedTrips.length !== 0) {
      this.setState({noTripsShared: false})
    }

    this.setState({loading: false})
    console.log(this.state.loading);

}



  handleSort = (str) => {
    if (str == "alpha") {
      var sorted_owned = this.state.sepTrips.owned.sort((a, b) => a.Name.localeCompare(b.Name)); //using String.prototype.localCompare()
      var sorted_shared = this.state.sepTrips.shared.sort((a, b) => a.Name.localeCompare(b.Name));

      var newSepTrips = {
        owned: sorted_owned,
        shared: sorted_shared
      }
      this.setState({sepTrips: newSepTrips})
    }
    else if (str == "date") {
      var sorted_owned  = this.state.sepTrips.owned.sort((a, b) => new Date(...a.StartDate.split('/').reverse()) - new Date(...b.StartDate.split('/').reverse()));
      var sorted_shared = this.state.sepTrips.shared.sort((a, b) => new Date(...a.StartDate.split('/').reverse()) - new Date(...b.StartDate.split('/').reverse()));

      var newSepTrips = {
        owned: sorted_owned,
        shared: sorted_shared
      }
      this.setState({sepTrips: newSepTrips})
    }
  }

  displayOwnedTrips = () => {
    return ((this.state.noTripsOwned && !this.state.loading ? <h1>You do not own any trips at this moment.</h1> :
      <div>
        <CardColumns>
          {this.state.sepTrips.owned.map((trip, index) => (
            <Card>
              <Card.Img style={{"height": "33%"}} variant="top" src={trip.ImgUrl} />
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
                <Card.Text>
                    {trip.IsLocked ? 'Locked' : 'Unlocked'}
                  </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Link to={`/editview/${trip.TripId}`}><Button className="edit-button"  variant="primary" size="lg" block>Edit</Button></Link>
              </Card.Footer>
            </Card>
          ))}
        </CardColumns>
      </div> ))
  }

  displaySharedTrips = () => {
    return ((this.state.noTripsShared && !this.state.loading ? <h1>You do have any shared trips at this moment.</h1> :
        <CardColumns>
          {this.state.sepTrips.shared.map((trip, index) => (
            <Card>
              <Card.Img style={{"height": "33%"}} variant="top" src={trip.ImgUrl} />
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
                <Link to={`/editview/${trip.TripId}`}><Button className="edit-button"  variant="primary" size="lg" block>Edit</Button></Link>
              </Card.Footer>
            </Card>
          ))}
        </CardColumns>

    ))
  }

  render() {
    let loadingSpinner =  <Spinner animation="border" role="status" variant="primary">
                            <span className="sr-only">Loading...</span>
                          </Spinner>;
    return (
      <div>
        <Link to="/createtrip"><Button style={{ position: "absolute", top: 75, left: 10, zIndex: 9999999 }}>
          <PlusCircle size={48} />
        </Button></Link>
        <div>
          <Dropdown style={{ position: "absolute", zIndex: 100, right: 10, top: 75 }}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Sort Trips
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => this.handleSort("alpha")}>Alphabetically</Dropdown.Item>
              <Dropdown.Item onClick={() => this.handleSort("date")}>By departure date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <h1>Trips Owned by You</h1>
        {/*this.state.loading ? loadingSpinner : this.displayOwnedTrips()*/}
        {this.displayOwnedTrips()}
        <hr />
        <h1>Trips Shared with You</h1>
        {/*this.state.loading ? loadingSpinner : this.displaySharedTrips()*/}
        {this.displaySharedTrips()}
      </div>
    );
  }
}

export default withAuth0(TripCards)
