import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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
          <Form.Control />
        </Form.Group>
        <Button variant="primary" type="submit">Search</Button>
      </Form>
      {searchResults.map((result) => (
        <p>{result.name}</p>
      ))}
    </div>
  );
};
