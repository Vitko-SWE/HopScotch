import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Card.css"

export default function AttractionSearch(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [searchResults, setSearchResults] = useState({
    ta: [],
    poi: [],
  });
  const [tripInfo, setTripInfo] = useState({});
  const [searchedYet, setSY] = useState(false);

  useEffect(() => {
    updateTripInfo();
  }, []);

  const updateTripInfo = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/gettrip/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        setTripInfo(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.currentTarget;
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/searches/attractionsearch/", {
        location: tripInfo.Destination,
        query: value.searchQuery.value,
        filter: value.searchFilter.value,
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res.data);
        let tempd = res.data;
        if (tempd.name === "Error" || Object.keys(tempd).length === 0) {
          tempd = {
            ta: [],
            poi: [],
          };
        }
        setSearchResults(tempd);
        setSY(true);
      }).catch((err) => {
        console.log(err);
        setSY(true);
      });
    });
  };

  const addTourToTrip = (result) => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/searches/addtour/", {
        tripid: props.match.params.tripid,
        id: result.id,
        geoCode: result.geoCode,
        bookingLink: result.bookingLink,
        price: result.price ? result.price.amount : "0",
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const addPOIToTrip = (result) => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/searches/addpoi/", {
        tripid: props.match.params.tripid,
        id: result.id,
        geoCode: result.geoCode,
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  return (
    <div>
      <h1>Attraction Search</h1>
      <Form onSubmit={handleSearch}>
        <p>Searching in destination location '{tripInfo.Destination}'</p>
        <Form.Group controlId="searchQuery">
          <Form.Control required />
        </Form.Group>
        <Form.Group controlId="searchFilter">
          <Form.Control as="select" required>
            <option>All</option>
            <option>Tours and Activities</option>
            <option>Points of Interest</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">Search</Button>
      </Form>
      {(searchResults.ta.length === 0 && searchResults.poi.length === 0 && searchedYet === true) && (
        <div>
          <h3>There were no matching results.</h3>
        </div>
      )}
      {searchResults.ta.length !== 0 && (
        <div>
          <h3>Tours and Activities</h3>
          <div className="custom_container">
            {searchResults.ta.map((result) => (
              <Card className="custom_card">
                <Card.Img variant="top" src={result.pictures[0]} />
                <Card.Body>
                  <Card.Title>{result.name}</Card.Title>
                  <Card.Text><a href={result.bookingLink}>Booking Link</a></Card.Text>
                  <Button onClick={() => addTourToTrip(result)}>Add to '{tripInfo.Name}'</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
      {searchResults.poi.length !== 0 && (
        <div>
          <h3>Points of Interest</h3>
          <div className="custom_container">
            {searchResults.poi.map((result) => (
              <Card className="custom_card">
                <Card.Body>
                  <Card.Title>{result.name}</Card.Title>
                  <Card.Text>Type: {result.category}</Card.Text>
                  <Button onClick={() => addPOIToTrip(result)}>Add to '{tripInfo.Name}'</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
