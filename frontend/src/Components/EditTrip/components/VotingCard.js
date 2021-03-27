import React from 'react'
import { Card } from 'react-bootstrap'

export default function VotingCard(props) {
    return (
        <div>
            <Card>
                <Card.Header>
                    <Card.Title>Test Title</Card.Title>
                </Card.Header>

                <Card.Body>
                    <h5>Test thing</h5>
                    <h6>Test info</h6>
                </Card.Body>

                <Card.Footer>
                    <Button>Thumbs up</Button>
                    <Button>Thumbs Down</Button>
                </Card.Footer>
            </Card>
        </div>
    )
}
