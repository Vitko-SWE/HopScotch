import React, { Component } from 'react';
import Card from '../TripCard/Card'
import pic from '../TripCard/canada_banff.jpg'
class TripCards extends Component {
  state = {
    trips:  [
      {
        trip_image: pic,
        trip_owner: [
            "HD"
        ],
        trip_name: "Canada Banff",
      },

      {
        trip_image: pic,
        trip_owner: [
            "Vitalii"
        ],
        trip_name: "Canada Banff",
      },

      {
        trip_image: pic,
        trip_owner: [
            "Vitalii"
        ],
        trip_name: "Canada Banff",
      },

      {
        trip_image: pic,
        trip_owner: [
            "Vitalii"
        ],
        trip_name: "Canada Banff",
      },

      {
        trip_image: pic,
        trip_owner: [
            "Vitalii"
        ],
        trip_name: "Canada Banff",
      },

      {
        trip_image: pic,
        trip_owner: [
            "Vitalii"
        ],
        trip_name: "Canada Banff",
      },

      {
        trip_image: pic,
        trip_owner: [
            "Vitalii"
        ],
        trip_name: "Canada Banff",
      },
    ],
  }

  render() {
    return (
      <div>
          <Card trips={this.state.trips}/>
      </div>
    )
  }
}

export default TripCards
