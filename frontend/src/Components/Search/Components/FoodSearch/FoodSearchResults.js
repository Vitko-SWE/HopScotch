import React from 'react'
import {Card} from 'react-bootstrap'
import Rating from '../../Rating'
import { FaYelp } from 'react-icons/fa';
import SelectTripDropdown from '../../SelectTripDropdown';

export default function FoodSearchResult(props) {

    return (
        <div>
        {props.foodSearchResult.length !== 0 && (
            <div className='card-display'>
                {props.foodSearchResult[0].items.map((item, index) =>
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
                    <SelectTripDropdown trips={props.foodTrips[0].items} diningOption={item}/>
                    </Card.Body>
                </Card>
                )}
            </div>
        )}
        </div>
    );

}