import React, { useEffect, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Card } from "react-bootstrap"

import AttractionModal from './AttractionModal'
import PoiModal from './PoiModal'


export default function AttractionsSearchResults(props) {

    const [attTrips, setAttTrips] = useState([]);
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        updateAttTrips();
      }, []);
    
    const updateAttTrips = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
          axios.get(`/api/trips/myeditabletrips`, {
            headers: {
              userid: user.sub,
              Authorization: `Bearer ${res}`,
            },
          }).then((res) => {
            setAttTrips(res.data);
          }).catch((err) => {
            console.log(err);
          });
        });
      };

    return (
        <div>
            {(props.attSearchResults.ta.length === 0 && props.attSearchResults.poi.length === 0 && props.searchedYet === true) && (
          <div>
            <h3>There were no matching results.</h3>
          </div>
        )}
        {props.attSearchResults.ta.length !== 0 && (
          <div>
            <h3>Tours and Activities</h3>
            <div className="custom_container">
              {props.attSearchResults.ta.map((result) => (
                <Card className="custom_card">
                  <Card.Img variant="top" src={result.pictures[0]} />
                  <Card.Body>
                    <Card.Title>{result.name}</Card.Title>
                    <Card.Text><strong>Price:</strong> {result.price.amount + " " + result.price.currencyCode}</Card.Text>
                    <Card.Text><a href={result.bookingLink}>Booking Link</a></Card.Text>
                  </Card.Body>
                  <Card.Body>
                    <AttractionModal trips={attTrips} result={result}/>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
        {props.attSearchResults.poi.length !== 0 && (
          <div>
            <h3>Points of Interest</h3>
            <div className="custom_container">
              {props.attSearchResults.poi.map((result) => (
                <Card className="custom_card">
                  <Card.Body>
                    <Card.Title>{result.name}</Card.Title>
                    <Card.Text><strong>Type:</strong> {result.category}</Card.Text>
                  </Card.Body>
                  <Card.Body>
                    <PoiModal trips={attTrips} result={result} />
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
    </div>
    );
}