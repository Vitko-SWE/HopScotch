import React, { useEffect, useState } from "react";
import { Form, Button, Card, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Card.css"

export default function AttractionSearch() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [searchResults, setSearchResults] = useState({
    ta: [],
    poi: [],
  });
  const [trips, setTrips] = useState([]);
  const [searchedYet, setSY] = useState(false);

  useEffect(() => {
    updateTrips();
  }, []);

  const updateTrips = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/homepage/myTrips`, {
        headers: {
          userid: user.sub,
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        setTrips(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.currentTarget;
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/search/attractionsearch/", {
        location: value.searchLocation.value,
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

  const addTourToTrip = (item, result) => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/search/addtour/", {
        tripid: item.TripId,
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

  const addPOIToTrip = (item, result) => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/search/addpoi/", {
        tripid: item.TripId,
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
        <Form.Group controlId="searchQuery">
          <Form.Label>Query</Form.Label><br />
          <Form.Control required />
        </Form.Group>
        <Form.Group controlId="searchLocation">
          <Form.Label>Location</Form.Label><br />
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
                  <DropdownButton id="dropdown-item-button" title="Add to trip">
                    {trips.map((item) => (
                      <Dropdown.Item onClick={() => addTourToTrip(item, result)} as="button">{item.Name}</Dropdown.Item>
                    ))}
                  </DropdownButton>
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
                  <DropdownButton id="dropdown-item-button" title="Add to trip">
                    {trips.map((item) => (
                      <Dropdown.Item onClick={() => addPOIToTrip(item, result)} as="button">{item.Name}</Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
