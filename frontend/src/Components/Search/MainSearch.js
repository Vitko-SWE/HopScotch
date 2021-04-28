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

  if (type === "Attractions") {
    return (
      <div>
        <SearchOptions 
          currentType = {type} 
          newType = {handleType}
        />
        <AttractionSearch/>
      </div>
    );
  }
  else if (type === "Food") {
    return (
      <div>
        <SearchOptions 
          currentType = {type} 
          newType = {handleType}
        />
        <FoodSearch/>
      </div>
    );
  }
  else if (type === "Hotels") {
    return (
      <div>
        <SearchOptions 
          currentType = {type} 
          newType = {handleType}
        />
        <HotelSearch/>
      </div>
    );
  }
  else if (type === "Flights") {
    return (
      <div>
        <SearchOptions 
          currentType = {type} 
          newType = {handleType}
        />
        <FlightSearch />
      </div>
    );
  }
};
