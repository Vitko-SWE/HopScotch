import React, { useEffect, useState } from "react";
import { Button, InputGroup, FormControl, Dropdown, DropdownButton, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { BsSearch } from 'react-icons/bs'
import "./Card.css";

export default function MainSearch() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [type, setType] = useState("Attractions");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const [attractionFilter, setAttractionFilter] = useState("All");
  const [attSearchResults, setAttSearchResults] = useState({
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
      axios.get(`/api/trips/myeditabletrips`, {
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


  const handleAttractionFilter = (e) => {
    setAttractionFilter(e);
  };
  const handleAttractionSearch = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/search/attractionsearch/", {
        location: location,
        query: query,
        filter: attractionFilter,
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
        setAttSearchResults(tempd);
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
        price: result.price.amount,
        picURL: result.pictures[0],
        name: result.name
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

  const handleType = (e) => {
    setType(e);
  };
  const handleQuery = (e) => {
    e.preventDefault();
    setQuery(e.currentTarget.value);
  };
  const handleLocation = (e) => {
    e.preventDefault();
    setLocation(e.currentTarget.value);
  };

  if (type === "Attractions") {
    return (
      <div>
        <h1>Search</h1>
        <div className="search-bar">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Find</InputGroup.Text>
            </InputGroup.Prepend>
            <DropdownButton title={type} onSelect={handleType} variant="outline-secondary">
              <Dropdown.Item eventKey="Attractions">Attractions</Dropdown.Item>
              <Dropdown.Item eventKey="Food">Food</Dropdown.Item>
              <Dropdown.Item eventKey="Hotels">Hotels</Dropdown.Item>
            </DropdownButton>
            <FormControl onChange={handleQuery} type="dining-str" placeholder="search query"/>
            <FormControl onChange={handleLocation} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
            <DropdownButton title={attractionFilter} onSelect={handleAttractionFilter} variant="outline-secondary">
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Tours and Activities">Tours and Activities</Dropdown.Item>
              <Dropdown.Item eventKey="Points of Interest">Points of Interest</Dropdown.Item>
            </DropdownButton>
            <InputGroup.Append>
              <Button className='search-btn' onClick={handleAttractionSearch}>
                <BsSearch size={20} />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        {(attSearchResults.ta.length === 0 && attSearchResults.poi.length === 0 && searchedYet === true) && (
          <div>
            <h3>There were no matching results.</h3>
          </div>
        )}
        {attSearchResults.ta.length !== 0 && (
          <div>
            <h3>Tours and Activities</h3>
            <div className="custom_container">
              {attSearchResults.ta.map((result) => (
                <Card className="custom_card">
                  <Card.Img variant="top" src={result.pictures[0]} />
                  <Card.Body>
                    <Card.Title>{result.name}</Card.Title>
                    <Card.Text><strong>Price:</strong> {result.price.amount + " " + result.price.currencyCode}</Card.Text>
                    <Card.Text><a href={result.bookingLink}>Booking Link</a></Card.Text>
                    <DropdownButton id="dropdown-item-button" title="Add to trip">
                      {trips.length === 0 && (
                        <Dropdown.Header>You do not have any editable trips.</Dropdown.Header>
                      )}
                      {trips.length !== 0 && trips.map((item) => (
                          <Dropdown.Item onClick={() => addTourToTrip(item, result)} as="button">{item.Name}</Dropdown.Item>
                        ))
                      }
                    </DropdownButton>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
        {attSearchResults.poi.length !== 0 && (
          <div>
            <h3>Points of Interest</h3>
            <div className="custom_container">
              {attSearchResults.poi.map((result) => (
                <Card className="custom_card">
                  <Card.Body>
                    <Card.Title>{result.name}</Card.Title>
                    <Card.Text><strong>Type:</strong> {result.category}</Card.Text>
                    <DropdownButton id="dropdown-item-button" title="Add to trip">
                      {trips.length === 0 && (
                        <Dropdown.Header>You do not have any editable trips.</Dropdown.Header>
                      )}
                      {trips.length !== 0 && trips.map((item) => (
                          <Dropdown.Item onClick={() => addPOIToTrip(item, result)} as="button">{item.Name}</Dropdown.Item>
                        ))
                      }
                    </DropdownButton>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  else if (type === "Food") {
    return (
      <div>
        <h1>Search</h1>
        <div className="search-bar">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Find</InputGroup.Text>
            </InputGroup.Prepend>
            <DropdownButton title={type} onSelect={handleType} variant="outline-secondary" id="input-group-dropdown-1">
              <Dropdown.Item eventKey="Attractions">Attractions</Dropdown.Item>
              <Dropdown.Item eventKey="Food">Food</Dropdown.Item>
              <Dropdown.Item eventKey="Hotels">Hotels</Dropdown.Item>
            </DropdownButton>
            <FormControl onChange={handleQuery} type="dining-str" placeholder="search query"/>
            <FormControl onChange={handleLocation} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
            <InputGroup.Append>
              <Button className='search-btn' onClick={null}>
                <BsSearch size={20} />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
    );
  }
  else if (type === "Hotels") {
    return (
      <div>
        <h1>Search</h1>
        <div className="search-bar">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Find</InputGroup.Text>
            </InputGroup.Prepend>
            <DropdownButton title={type} onSelect={handleType} variant="outline-secondary" id="input-group-dropdown-1">
              <Dropdown.Item eventKey="Attractions">Attractions</Dropdown.Item>
              <Dropdown.Item eventKey="Food">Food</Dropdown.Item>
              <Dropdown.Item eventKey="Hotels">Hotels</Dropdown.Item>
            </DropdownButton>
            <FormControl onChange={handleQuery} type="dining-str" placeholder="search query"/>
            <FormControl onChange={handleLocation} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
            <InputGroup.Append>
              <Button className='search-btn' onClick={null}>
                <BsSearch size={20} />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
    );
  }
};
