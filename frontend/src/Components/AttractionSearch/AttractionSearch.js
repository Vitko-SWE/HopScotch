import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../TripCard/Card.css"

export default function AttractionSearch() {
  const { getAccessTokenSilently } = useAuth0();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.currentTarget.searchQuery.value;
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/searches/attractionsearch/${encodeURIComponent(value)}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        //console.log(res.data);
        setSearchResults(res.data.data);
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
          <Form.Control required />
        </Form.Group>
        <Button variant="primary" type="submit">Search</Button>
      </Form>
      <div className="custom_container">
      {searchResults.map((result) => (
        <Card className="custom_card">
          <Card.Img variant="top" src={result.pictures[0]} />
          <Card.Body>
            <Card.Title>{result.name}</Card.Title>
            <Card.Text>{result.shortDescription}</Card.Text>
            <Card.Text><a href={result.bookingLink}>Booking Link</a></Card.Text>
          </Card.Body>
        </Card>
      ))}
      </div>
    </div>
  );
};
