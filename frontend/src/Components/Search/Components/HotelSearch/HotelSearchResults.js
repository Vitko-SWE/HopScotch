import React from 'react'
import { Card } from 'react-bootstrap'
import SelectHotelTripDropdown from '../../SelectHotelTripDropdown'

export default function HotelSearchResults(props) {
    return (
        <div> 
        {props.hotelSearchResults.length !== 0 && (
            <div className='card-display'>
                {props.hotelSearchResults.map((item, index) =>
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
                    <SelectHotelTripDropdown trips={props.hotelTrips} hotelOption={item}/>
                    </Card.Body>
                </Card>
                )}
            </div>
        )};
    </div>
    );
}