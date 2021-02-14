import React, { Component } from 'react';
import Card from '../TripCard/Card'
import pic from '../TripCard/canada_banff.jpg'
import { Container, Row, Col } from 'react-bootstrap';


class Trip extends Component {
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





































// Fake data stracture to emulate trips
// var trips = [
//     {
//         trip_image: pic,
//         trip_owner: [
//             "HD"
//         ],
//         trip_name: "Canada Banff",
//     },

//     {
//         trip_image: pic,
//         trip_owner: [
//             "Vitalii"
//         ],
//         trip_name: "Canada Banff",
//     }
// ]

// const Trip= (props) => {
 

//   return (
//     <div>
//       <Card trips_obj={trips}/>
//       {/* {trips.map((value) => (
//               <Card 
//                   trip_name={value.trip_name} 
//                   trip_img={value.trip_image} 
//                   trip_owner={value.trip_owner}/>
//             ))} */}
//     </div>
//   );
// }


export default Trip
