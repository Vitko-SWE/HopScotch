import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Card.css"

export default function AttractionSearch() {
  const { getAccessTokenSilently } = useAuth0();
  const [searchResults, setSearchResults] = useState({
    ta: [],
    poi: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.currentTarget;
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/searches/attractionsearch/", {
        latitude: value.searchLatitude.value,
        longitude: value.searchLongitude.value,
        query: value.searchQuery.value,
        filter: value.searchFilter.value,
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res.data);
        setSearchResults(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  return (
    <div>
      <h1>Attraction Search</h1>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="searchLatitude">
          <Form.Control required />
        </Form.Group>
        <Form.Group controlId="searchLongitude">
          <Form.Control required />
        </Form.Group>
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
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
