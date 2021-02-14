import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../TripCard/Card.css"


const MakeCard = (props) => {
  return (
      <div className="custom_container">
        {props.trips.map((trip) =>
        <Card className="custom_card">
          <Card.Img variant="top" src={trip.trip_image} />
          <Card.Body>
            <Card.Title>{trip.trip_name}</Card.Title>
            <Card.Text>
              Days Remaining: 365
            </Card.Text>
            <Card.Text>
              Trip Organizer: {trip.trip_owner}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
             <Button  variant="primary" size="lg" block>Edit</Button>
             <Button  variant="danger" size="lg" block>Exit Trip</Button>
            </small>
          </Card.Footer>
        </Card>
        )}
        </div>
  );
}

export default MakeCard