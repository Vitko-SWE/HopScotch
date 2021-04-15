import React, { useEffect, useState } from "react";
import { Button, InputGroup, FormControl, Dropdown, DropdownButton, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { BsSearch } from 'react-icons/bs'
import { FaYelp } from 'react-icons/fa';
import Rating from './Rating';
import SelectTripDropdown from './SelectTripDropdown';
import SelectHotelTripDropdown from './SelectHotelTripDropdown';
import FlightSearch from '../FlightSearch/FlightSearch';
import "./Card.css";

export default function MainSearch() {
  // General Globals
  const { user, getAccessTokenSilently } = useAuth0();
  const [type, setType] = useState("Attractions");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  // Attraction Globals
  const [attractionFilter, setAttractionFilter] = useState("All");
  const [attSearchResults, setAttSearchResults] = useState({
    ta: [],
    poi: [],
  });
  const [attTrips, setAttTrips] = useState([]);
  const [searchedYet, setSY] = useState(false);

  // Food Globals
  const foodSearchResult = useState({items: []})
  const foodTrips = useState({items: []});

  // Hotel Globals
  const [hotelSearchResult, setHotelSearchResult] = useState([]);
  const [hotelTrips, setHotelTrips] = useState([]);

  // Attraction Functions
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
        alert("The tour/activity has been added to the selected trip.");
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
        alert("The point of interest has been added to the selected trip.");
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  // Food Functions
  const getFoodTrips = async () => {
    getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
      const token = `Bearer ${res}`;
      const api = axios.create({
        baseURL: '/api/homepage/myTrips',
        headers: {
          userid: user.sub,
          Authorization: token
        }
      });
      try {
        api.get('/').then(response => {
          foodTrips[1]({items: response.data});
        });
      } catch (err) {
        console.log(err);
      }
    });
  };
  const handleFoodSearch = () => {
    getFoodTrips();
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get('/api/search/searchDining', {
        headers: {
          Authorization: `Bearer ${res}`,
          string: query,
          city: location,
        },
      }).then((res) => {
        foodSearchResult[1]({items: res.data});

        if (res.data.length === 0) {
          alert("Oops, it looks like we couldn't find anything for this location");
        }
      }).catch((err) => {
        console.log(err);
        alert("Oops, it looks like we couldn't find anything for this location");
      });
    });
  };

  // Hotel Functions
  const getHotelTrips = async () => {
    getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
      const token = `Bearer ${res}`;
      const api = axios.create({
        baseURL: '/api/homepage/myTrips',
        headers: {
          userid: user.sub,
          Authorization: token,
        }
      })
      try {
        api.get('/').then(response => {
          //update state trips array
          setHotelTrips(response.data);
        });
      } catch (err) {
        console.log(err);
      }
    });
  };
  const handleHotelSearch = () => {
    getHotelTrips();
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get('/api/hotel/search', {
        headers: {
          Authorization: `Bearer ${res}`,
          hotel: query,
          location: location,
        },
      }).then(async (res) => {
        await setHotelSearchResult(res.data);
        console.log(hotelSearchResult);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  // General Functions
  const handleType = (e) => {
    setType(e);
    setAttSearchResults({
      ta: [],
      poi: [],
    });
    setSY(false);
    foodSearchResult[1]({items: []});
    setHotelSearchResult([]);
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
              <Dropdown.Item eventKey="Flights">Flights</Dropdown.Item>
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
                      {attTrips.length === 0 && (
                        <Dropdown.Header>You do not have any editable trips.</Dropdown.Header>
                      )}
                      {attTrips.length !== 0 && attTrips.map((item) => (
                        !item.IsLocked ?
                          <div><Dropdown.Item onClick={() => addTourToTrip(item, result)} as="button">{item.Name}</Dropdown.Item></div> :
                          <div><Dropdown.Item disabled>{item.Name}</Dropdown.Item></div>
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
                      {attTrips.length === 0 && (
                        <Dropdown.Header>You do not have any editable trips.</Dropdown.Header>
                      )}
                      {attTrips.length !== 0 && attTrips.map((item) => (
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
    if (foodSearchResult[0].items.length === 0) {
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
                <Dropdown.Item eventKey="Flights">Flights</Dropdown.Item>
              </DropdownButton>
              <FormControl onChange={handleQuery} type="dining-str" placeholder="Breakfast, Coffee, Pizza..."/>
              <FormControl onChange={handleLocation} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
              <InputGroup.Append>
                <Button className='search-btn' onClick={handleFoodSearch}>
                  <BsSearch size={20} />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
      );
    }
    else {
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
                <Dropdown.Item eventKey="Flights">Flights</Dropdown.Item>
              </DropdownButton>
              <FormControl onChange={handleQuery} type="dining-str" placeholder="Breakfast, Coffee, Pizza..."/>
              <FormControl onChange={handleLocation} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
              <InputGroup.Append>
                <Button className='search-btn' onClick={handleFoodSearch}>
                  <BsSearch size={20} />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div className='card-display'>
            {foodSearchResult[0].items.map((item, index) =>
              <Card className="custom_card" style={{ width: '19%' }}>
                <Card.Img style={{width: '100%', height: '280px'}} variant="top" src={item.image_url} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <Rating rating={item.rating}/>
                    <Card.Text className="text-muted">{item.review_count} reviews</Card.Text>
                  </Card.Text>
                  <Card.Text>Price: {item.price}</Card.Text>
                  <Card.Text>{item.location.address1}, {item.location.city}, {item.location.state}</Card.Text>
                </Card.Body>
                <Card.Body>
                  <Card.Body>
                    <a href={item.url}>
                      <FaYelp size={50} style={{fill: 'red' }} />
                    </a>
                    <h1>Yelp</h1>
                    <p>Read more on Yelp</p>
                  </Card.Body>
                  <SelectTripDropdown trips={foodTrips[0].items} diningOption={item}/>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      )
    }
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
              <Dropdown.Item eventKey="Flights">Flights</Dropdown.Item>
            </DropdownButton>
            <FormControl onChange={handleQuery} type="dining-str" placeholder="search query"/>
            <FormControl onChange={handleLocation} type="location-str" placeholder="address, neighborhood, city, state or zip"/>
            <InputGroup.Append>
              <Button className='search-btn' onClick={handleHotelSearch}>
                <BsSearch size={20} />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        {hotelSearchResult.length > 0 &&
        <div className='card-display'>
          {hotelSearchResult.map((item, index) =>
            <Card className="custom_card" style={{ width: '19%' }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Rating: {item.rating}/5
                </Card.Text>
                <Card.Text>Address: {item.formatted_address}</Card.Text>
                <a href={item.url} className="btn btn-primary">Visit on google maps</a>
                <h1></h1>
                <a href={item.website} className="btn btn-primary">Visit hotel's website</a>
                <h1></h1>
                <SelectHotelTripDropdown trips={hotelTrips} hotelOption={item}/>
              </Card.Body>
            </Card>
          )}
        </div>
        }
      </div>
    );
  }
  else if (type === "Flights") {
    return (
      <div>
        <DropdownButton title={type} onSelect={handleType} variant="outline-secondary" id="input-group-dropdown-1">
          <Dropdown.Item eventKey="Attractions">Attractions</Dropdown.Item>
          <Dropdown.Item eventKey="Food">Food</Dropdown.Item>
          <Dropdown.Item eventKey="Hotels">Hotels</Dropdown.Item>
          <Dropdown.Item eventKey="Flights">Flights</Dropdown.Item>
        </DropdownButton>
        <FlightSearch />
      </div>
    );
  }
};
