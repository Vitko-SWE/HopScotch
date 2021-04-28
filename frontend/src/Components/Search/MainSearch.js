import React, { useState } from "react";
import FlightSearch from '../FlightSearch/FlightSearch';
import "./Card.css";
import SearchOptions from "./Components/SearchOptions/SearchOptions" 
import AttractionSearch from "./Components/AttractionsSearch/AttractionsSearch"
import FoodSearch from "./Components/FoodSearch/FoodSearch"
import HotelSearch from "./Components/HotelSearch/HotelSearch"
import "./MainSearch.css"

export default function MainSearch() {
  // General Globals
  const [type, setType] = useState("Attractions");

  // General Functions
  const handleType = (e) => {
    setType(e);
  };

  return (
    <>
      <SearchOptions
        currentType = {type}
        newType = {handleType}
      />

      {type == "Attractions" && (
        <AttractionSearch />
      )}

      {type == "Food" && (
        <FoodSearch />
      )}

      {type == "Hotels" && (
        <HotelSearch />
      )}

      {type == "Flights" && (
        <FlightSearch />
      )}
    </>
  )
};
