import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap'

export default function SearchOptions(props) {

    const sendType = (newType) => {
        props.newType(newType)
    }
    return(
    <div>
        <h1 className="title-format">Search:</h1>
        <div>
        <ButtonToolbar className='justify-content-center'>
            <Button className={props.currentType === "Attractions" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => sendType("Attractions")}>Attractions/POI's</Button>
            <Button className={props.currentType === "Food" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => sendType("Food")}>Food</Button>
            <Button className={props.currentType === "Hotels" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => sendType("Hotels")}>Hotels</Button>
            <Button className={props.currentType === "Flights" ? 'active button-format btn-lg btn-secondary' : 'button-format btn-lg btn-secondary'} onClick={() => sendType("Flights")}>Flights</Button>
        </ButtonToolbar>
        </div>
    </div>
    );
}