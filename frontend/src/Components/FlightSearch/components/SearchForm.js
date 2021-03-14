import React from 'react'
import { Form, Col, Button } from 'react-bootstrap'

export default function SearchForm() {
    const handleSubmit = e => {
        e.preventDefault();
        const results = e.currentTarget;
    }
    
    return (
        <div>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} controlId="fsOriginGroup">
                        <Form.Control placeholder="Where are we starting?" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="fsDestGroup">
                        <Form.Control placeholder="Where to?" />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="fsDepartDateGroup">
                        <Form.Label>When are we leaving?</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="fsReturnDateGroup">
                        <Form.Label>When are we coming back?</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="fsNumPassGroup">
                        <Form.Label>How many people?</Form.Label>
                        <Form.Control type="number" placeholder="Enter number of passengers for flight" />
                    </Form.Group>
                </Form.Row>

                <Button>Submit</Button>
            </Form>
        </div>
    )
}
