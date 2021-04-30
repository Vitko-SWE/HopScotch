//Some auto complete code borrowed from Amadeus API docs and applied to our own setup

import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Form, Col, Button } from 'react-bootstrap'
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from 'react-router';
import { Typeahead } from "react-bootstrap-typeahead";
import { debounce } from "lodash";

import "./SearchForm.css"

export default function SearchForm(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const history = useHistory();

    const [deptSelected, setDeptSelected] = useState(null)
    const [deptOptions, setDeptOptions] = useState([])
    const [deptSearch, setDeptSearch] = useState("")
    const [deptKeyword, setDeptKeyword] = useState("")
    const [deptLoading, setDeptLoading] = useState(false)

    const [retSelected, setRetSelected] = useState(null)
    const [retOptions, setRetOptions] = useState([])
    const [retSearch, setRetSearch] = useState("")
    const [retKeyword, setRetKeyword] = useState("")
    const [retLoading, setRetLoading] = useState(false)

    const deptDebounceLoadData = useCallback(debounce(setDeptKeyword, 1000), []);
    const retDebounceLoadData = useCallback(debounce(setRetKeyword, 1000), []);

    useEffect(() => {
        deptDebounceLoadData(deptSearch)
    }, [deptSearch])

    useEffect(() => {
        retDebounceLoadData(retSearch)
    }, [retSearch])

    useEffect(() => {
        setDeptLoading(true)

        const CancelToken = axios.CancelToken;

        // Amadeus API require at least 1 character, so with this we can be sure that we can make this request
        const searchQuery = deptKeyword ? deptKeyword : "a";

        // This is extra tool for cancelation request, to avoid overload API 
        const source = CancelToken.source();

        // GET request with all params we need
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            const token = `Bearer ${res}`
            axios.post(`/api/flights/airports?keyword=${searchQuery}&page=1&subType=AIRPORT`, {
                cancelToken: source.token
            }, {
                headers: {
                    Authorization: `Bearer ${res}`,
                },
            }).then(res => {
                if (!res.data.code) {
                    setDeptOptions(res.data.data)
                }

                setDeptLoading(false)
            }).catch(err => {
                console.log("****")
                console.log(err)
                axios.isCancel(err);
                setDeptOptions([])
                setDeptLoading(false)
            })
        })

        return () => {
            source.cancel()
        }
    }, [deptKeyword])

    useEffect(() => {
        setRetLoading(true)

        const CancelToken = axios.CancelToken;

        // Amadeus API require at least 1 character, so with this we can be sure that we can make this request
        const searchQuery = retKeyword ? retKeyword : "a";

        // This is extra tool for cancelation request, to avoid overload API 
        const source = CancelToken.source();

        // GET request with all params we need
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            const token = `Bearer ${res}`
            axios.post(`/api/flights/airports?keyword=${searchQuery}&page=1&subType=AIRPORT`, {
                cancelToken: source.token
            }, {
                headers: {
                    Authorization: `Bearer ${res}`,
                },
            }).then(res => {
                if (!res.data.code) {
                    setRetOptions(res.data.data)
                }

                setRetLoading(false)
            }).catch(err => {
                console.log("****")
                console.log(err)
                axios.isCancel(err);
                setRetOptions([])
                setRetLoading(false)
            })
        })

        return () => {
            source.cancel()
        }
    }, [retKeyword])

    const handleSubmit = e => {
        e.preventDefault();
        props.loadingCallback(true)
        const results = e.currentTarget;

        if (deptSelected.length != 1 && retSelected.length != 1) {
            return;
            //TODO ERROR
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            const authToken = res;
            axios.get("/api/search/flights", {
                params: {
                    originCode: deptSelected[0].iataCode,
                    destCode: retSelected[0].iataCode,
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
                }).catch(err => {
                    console.log(err)
                })
            });
        });
    }

    return (
        <div className="margins">
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Col>
                        <Form.Label>Origin</Form.Label>
                        <Typeahead
                            onChange={(selected) => {
                                setDeptSelected(selected)
                            }}
                            onInputChange={(text, e) => {
                                setDeptSearch(text)
                            }}
                            labelKey={option => {
                                if(option.address.stateCode) {
                                    return `${option.name} - ${option.address.cityName}, ${option.address.stateCode}`
                                } else {
                                    return `${option.name} - ${option.address.cityName}`
                                }
                            }}
                            options={deptOptions}
                            isLoading={deptLoading}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Destination</Form.Label>
                        <Typeahead
                            onChange={(selected) => {
                                setRetSelected(selected)
                            }}
                            onInputChange={(text, e) => {
                                setRetSearch(text)
                            }}
                            labelKey={option => `${option.name} - ${option.address.cityName}, ${option.address.stateCode}`}
                            options={retOptions}
                            isLoading={retLoading}
                        />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="fsDepartDateGroup">
                        <Form.Label>Depature date:</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="fsReturnDateGroup">
                        <Form.Label>Return date:</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="fsNumPassGroup">
                        <Form.Label># of adult travellers:</Form.Label>
                        <Form.Control type="number" />
                    </Form.Group>
                </Form.Row>
                <Button type="submit">Search</Button>
            </Form>
        </div>
    )
}
