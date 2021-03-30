import axios from 'axios';
import React from 'react'
import { Form, Col, Button } from 'react-bootstrap'
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from 'react-router';

export default function SearchForm(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        props.loadingCallback(true)
        const results = e.currentTarget;

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            const authToken = res;
            axios.get("/api/search/flights", {
                params: {
                    originCode: results.fsOriginGroup.value,
                    destCode: results.fsDestGroup.value,
                    deptDate: results.fsDepartDateGroup.value,
                    retDate: results.fsReturnDateGroup.value,
                    numPass: results.fsNumPassGroup.value
                },
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }).then(res => {
                const flightData = res.data
                axios.get('/api/homepage/myTrips', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        userid: user.sub
                    }
                }).then((res) => {
                    console.log(res);
                    props.loadingCallback(false);
                    history.push({
                        pathname: '/search/flights/results',
                        state: {
                            data: flightData,
                            trips: res.data
                        }
                    });
                });
            });
        });
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
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

                <Button type="submit">Search</Button>
            </Form>
        </div>
    )
}
