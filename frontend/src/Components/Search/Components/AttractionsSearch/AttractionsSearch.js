import React, {useState} from 'react'
import { InputGroup, FormControl, Button, ButtonToolbar } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";

import AttractionSearchResults from './AttractionsSearchResults'

export default function AttractionSearch(props) {

  const { user, getAccessTokenSilently } = useAuth0();

  const [attractionQuery, setAttractionQuery] = useState("");
  const [attractionLocation, setAttractionLocation] = useState("");
  const [attractionFilter, setAttractionFilter] = useState("All");

  const [attSearchResults, setAttSearchResults] = useState({
    ta: [],
    poi: [],
  });

  const [searchedYet, setSY] = useState(false);

  const handleSetAttractionQuery = (e) => {
    e.preventDefault();
    setAttractionQuery(e.currentTarget.value);
  }

  const handleSetAttractionLocation = (e) => {
    e.preventDefault();
    setAttractionLocation(e.currentTarget.value);
  }

  const handleAttractionSearch = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post("/api/search/attractionsearch/", {
        location: attractionLocation,
        query: attractionQuery,
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


  return(
    <div className="search-bar">
      <h2>Enter attraction and/or POI here:</h2>
      <InputGroup>
        <FormControl size='lg' onChange={handleSetAttractionQuery} type="attractions-str" placeholder="Enter Attraction or Point of Interest"/>
      </InputGroup>
      <h2 className='attraction-titleformat'>Enter location here:</h2>
      <InputGroup>
        <FormControl size='lg' onChange={handleSetAttractionLocation} type="location-str" placeholder="Where to?"/>
      </InputGroup>
      <h2 className='attraction-titleformat'>Search for:</h2>
      <ButtonToolbar className='justify-content-center'>
        <Button className={attractionFilter === "Tours and Activities" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => setAttractionFilter("Tours and Activities")}>Attractions</Button>
        <Button className={attractionFilter === "Points of Interest" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => setAttractionFilter("Points of Interest")}>Points of Interest</Button>
        <Button className={attractionFilter === "All" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => setAttractionFilter("All")}>All</Button>
      </ButtonToolbar>
      <div className='attraction-search-button'>
        <Button onClick={handleAttractionSearch}>
        <BsSearch size={20} />
        </Button>
      </div>
      <div>
        <AttractionSearchResults
          attSearchResults = {attSearchResults}
          searchedYet = {searchedYet}
          attSearchResults = {attSearchResults}
          />
      </div>
    </div>

  )
}