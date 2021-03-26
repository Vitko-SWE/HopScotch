import React from 'react'
import FlightCard from './components/FlightCard'

export default function FlightSearchResults(props) {
    const {state} = props.location
    console.log(state.data)

    return (
        <div>
            {/* <FlightCard /> */}
            {state.data.data.map((item, i) => {
                return(
                    <FlightCard key={item.id} itineraries={item.itineraries} price={item.price} airlines={item.validatingAirlineCodes}/>
                )
            })}
        </div>
    )
}
