import React, { useState } from 'react'
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import StickyBox from "react-sticky-box";
import PropTypes from 'prop-types';

export default function SearchFilter(props) {
    const handleSort = e => {
        e.preventDefault();

        const results = e.currentTarget;
        var sorts = {};

        if (props.price) {
            sorts.priceSort = results.priceSort.value
        }

        if (props.distance) {
            sorts.distanceSort = results.distanceSort.value
        }

        props.sortFunc(sorts)
    }

    const handleFilter = e => {
        e.preventDefault();

        const results = e.currentTarget;
        var filters = {};

        if (props.price) {
            if (results.minPrice.value.length == 0) {
                filters.minPrice = 0
            } else {
                filters.minPrice = parseInt(results.minPrice.value)
            }

            if (results.maxPrice.value.length == 0) {
                filters.maxPrice = null
            } else {
                filters.maxPrice = parseInt(results.maxPrice.value)
            }
        }

        if (props.stops) {
            if (results.maxStops.value == "No Max") {
                filters.maxStops = null
            } else {
                filters.maxStops = parseInt(results.maxStops.value)
            }
        }

        if (props.carriers) {
            //TODO
            filters.carriers = null
        }

        if (props.ratings) {
            filters.ratings = parseInt(results.ratings.value)
        }

        if (props.distance) {
            if (results.distance.value == "No Max") {
                filters.distance = null
            } else {
                filters.distance = parseInt(results.distance.value)
            }
        }

        if (props.relativePrice) {
            filters.minRelativePrice = parseInt(results.minRelativePrice.value)
            filters.maxRelativePrice = parseInt(results.maxRelativePrice.value)
        }

        props.filterFunc(filters)
    }

    return (
        <StickyBox className="mt-5" offsetTop={20} offsetBottom={20} style={{ border: '1px solid gray', borderRadius: '5px' }}>
            <Container className="p-3 mr-5">
                <Row className="ml-1">
                    <h1>Sort</h1>
                </Row>

                <Form onSubmit={handleSort}>
                    {props.price && (
                        <Row><Col>
                            <Form.Group controlId="priceSort">
                                <Form.Label>Sort by Price</Form.Label>
                                <Form.Control as="select">
                                    <option>Low to High</option>
                                    <option>High to Low</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}

                    {props.distance && (
                        <Row><Col>
                            <Form.Group controlId="distanceSort">
                                <Form.Label>Sort by Price</Form.Label>
                                <Form.Control as="select">
                                    <option>Low to High</option>
                                    <option>High to Low</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}
                    <Button type="submit">Sort Results</Button>
                </Form>

                <Row className="ml-1">
                    <h1>Filters</h1>
                </Row>

                <Form onSubmit={handleFilter}>
                    {props.price && ( // Absolute Price
                        <Row><Col>
                            <Form.Group controlId="minPrice">
                                <Form.Label>Min Price</Form.Label>
                                <Form.Control type="number" placeholder="Min Price" />
                            </Form.Group>

                            <Form.Group controlId="maxPrice">
                                <Form.Label>Max Price</Form.Label>
                                <Form.Control type="number" placeholder="Max Price" />
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}

                    {props.stops && ( // Number of stops
                        <Row><Col>
                            <Form.Group controlId="maxStops">
                                <Form.Label>Max Stops</Form.Label>
                                <Form.Control as="select">
                                    <option>No Max</option>
                                    <option value="0">Nonstop Only</option>
                                    <option value="1">1 Stop</option>
                                    <option value="2">2 Stops</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}

                    {props.carriers && ( // Carriers
                        <Row><Col>
                            <h5>Select Carriers</h5>
                            <h6>No idea how to implement this one. Rip.</h6>
                            <hr />
                        </Col></Row>
                    )}

                    {props.ratings && ( // Rating
                        <Row><Col>
                            <Form.Group controlId="ratings">
                                <Form.Label>Min Rating</Form.Label>
                                <Form.Control as="select">
                                    <option value="1">1 ⭐️</option>
                                    <option value="2">2 ⭐️</option>
                                    <option value="3">3 ⭐️</option>
                                    <option value="4">4 ⭐️</option>
                                    <option value="5">5 ⭐️</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}

                    {props.distance && ( // Distance
                        <Row><Col>
                            <Form.Group controlId="distance">
                                <Form.Label>Max Distance</Form.Label>
                                <Form.Control as="select">
                                    <option>No Max</option>
                                    <option value="10">10 Miles</option>
                                    <option value="25">25 Miles</option>
                                    <option value="50">50 Miles</option>
                                    <option value="100">100 Miles</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}

                    {props.relativePrice && ( // Relative Price
                        <Row><Col>
                            <Form.Group controlId="minRelativePrice">
                                <Form.Label>Min Price</Form.Label>
                                <Form.Control as="select">
                                    <option value="1">$</option>
                                    <option value="2">$$</option>
                                    <option value="3">$$$</option>
                                    <option value="4">$$$$</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="maxRelativePrice">
                                <Form.Label>Max Price</Form.Label>
                                <Form.Control as="select" defaultValue="4">
                                    <option value="1">$</option>
                                    <option value="2">$$</option>
                                    <option value="3">$$$</option>
                                    <option value="4">$$$$</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                        </Col></Row>
                    )}

                    <Button type="submit">Apply Filters</Button>
                </Form>
            </Container>
        </StickyBox>
    )
}

SearchFilter.propTypes = {
    filterFunc: PropTypes.func.isRequired,
    price: PropTypes.bool,
    stops: PropTypes.bool,
    carriers: PropTypes.bool,
    ratings: PropTypes.bool,
    distance: PropTypes.bool,
    relativePrice: PropTypes.bool
}
