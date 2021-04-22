import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Card, Button, Collapse, Spinner } from 'react-bootstrap'
import { HandThumbsUp, HandThumbsDown } from "react-bootstrap-icons";
import { RiExternalLinkLine } from 'react-icons/ri';

export default function VotingCard(props) {
    const { user, getAccessTokenSilently } = useAuth0()
    const [loading, setLoading] = useState(false)
    const [lockout, setLockout] = useState(false)

    useEffect(() => {
        if(props.confirmed == "true") {
            setLockout(true)
        }
    }, [props.confirmed])

    const handleVote = (score) => {
        if (props.tripid == null || props.featureid == null
            || props.isflight == null) {
            setLoading(false)
            alert("error")
            return
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
            axios.post("/api/trips/vote", {
                tripid: props.tripid,
                userid: user.sub,
                featureid: props.featureid,
                isflight: props.isflight,
                score: score
            }, {
                headers: {
                    Authorization: `Bearer ${res}`
                }
            }).then(res => {
                setLoading(false)
                if (res.status == 200) {
                    console.log(res)
                    alert("Vote recorded!") //TODO: get rid of this    
                } else {
                    alert("Error.")
                }
            }).catch(err => {
                console.log(err)
                setLoading(false)
                alert("error")
            })
        }).catch(err => {
            console.log(err)
            setLoading(false)
            alert("error")
        })
    }

    const handleThumbsUp = e => {
        setLoading(true)
        handleVote(1)
    }

    const handleThumbsDown = e => {
        setLoading(true)
        handleVote(-1)
    }

    const handleConfAction = action => {
        if (props.tripid == null || props.featureid == null
            || props.isflight == null) {
            setLoading(false)
            alert("error")
            return
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
            axios.post(`/api/trips/confirmFeature/${props.tripid}/${props.featureid}`, {
                confirmed: action,
                isFlight: props.isflight
            }, {
                headers: {
                    Authorization: `Bearer ${res}`
                }
            }).then(res => {
                setLoading(false)
                if (res.status == 200) {
                    console.log(res)
                    alert("Confirmed!") //TODO: get rid of this    
                } else {
                    alert("Error.")
                }
            }).catch(err => {
                console.log(err)
                setLoading(false)
                alert("error")
            })
        }).catch(err => {
            console.log(err)
            setLoading(false)
            alert("error")
        })
    }

    const handleConfirm = e => {
        setLoading(true)
        handleConfAction("true")
    }

    const handleUnconfirm = e => {
        setLoading(true)
        handleConfAction("false")
    }

    const handleDelete = e => {
        if (props.tripid == null || props.featureid == null
            || props.isflight == null) {
            setLoading(false)
            alert("error")
            return
        }

        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
            axios.post(`/api/trips/deleteFeature/${props.tripid}/${props.featureid}`, {
                isFlight: props.isflight
            }, {
                headers: {
                    Authorization: `Bearer ${res}`
                }
            }).then(res => {
                setLoading(false)
                if (res.status == 200) {
                    console.log(res)
                    alert("Deleted!") //TODO: get rid of this    
                } else {
                    alert("Error.")
                }
            }).catch(err => {
                console.log(err)
                setLoading(false)
                alert("error")
            })
        }).catch(err => {
            console.log(err)
            setLoading(false)
            alert("error")
        })
    }

    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>
                        {props.title ? (
                            <div>{props.title}</div>
                        ) : (
                            <div>Title not found.</div>
                        )}
                    </Card.Title>

                    <Card.Subtitle>
                        {props.type ? (
                            <div>{props.type}</div>
                        ) : (
                            <div>Type not found.</div>
                        )}
                    </Card.Subtitle>
                </Card.Header>

                <Collapse in={!lockout}>
                    <Card.Body>
                        {props.voters ? (
                            <h5>Score: {props.score}</h5>
                        ) : (
                            <h5>Score not found.</h5>
                        )}

                        {props.voters ? (
                            <div>
                                <h7>Voters: </h7>
                                {props.voters.map((item, i) => {
                                    return (
                                        <div key={i}>{item} </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <h7>Voters not found.</h7>
                        )}

                        {(props.bookingURL && props.bookingURL != "undefined") ? (
                            <>
                                <hr />
                                <a href={props.bookingURL} target="_blank">
                                    <RiExternalLinkLine size={50} style={{ fill: 'red' }} />
                                </a>
                                <p>Read more about booking</p>
                            </>
                        ) : (
                            <>
                                <hr />
                                <h6>Booking URL not specified.</h6>
                            </>
                        )}

                        <hr />

                        <Button className="mr-3" variant="success" onClick={handleThumbsUp} disabled={lockout}>
                            <HandThumbsUp size={36} />
                        </Button>

                        <Button variant="danger" onClick={handleThumbsDown} disabled={lockout}>
                            <HandThumbsDown size={36} />
                        </Button>
                    </Card.Body>
                </Collapse>

                <Collapse in={lockout}>
                    <Card.Text className="mt-3">Component Confirmed!</Card.Text>
                </Collapse>

                <Card.Footer>
                    <h6>Owner Actions</h6>
                    {props.confirmed == "true" ? (
                        <Button className="mr-2" variant="outline-warning" onClick={handleUnconfirm} >Unconfirm</Button>
                    ) : (
                        <Button className="mr-2" variant="warning" onClick={handleConfirm} >Confirm</Button>
                    )}
                    <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>
                </Card.Footer>

                <Collapse in={loading}>
                    <Card.Footer>
                        <Spinner animation="border" />
                    </Card.Footer>
                </Collapse>
            </Card>
        </>
    )
}
