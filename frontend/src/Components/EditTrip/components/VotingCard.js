import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Card, Button, Collapse, Spinner } from 'react-bootstrap'
import { HandThumbsUp, HandThumbsDown } from "react-bootstrap-icons";

export default function VotingCard(props) {
    const { user, getAccessTokenSilently } = useAuth0()
    const [loading, setLoading] = useState(false)
    const [lockout, setLockout] = useState(false)

    const handleVote = (score) => {
        if (props.tripid == null || props.featureid == null
            || props.isflight == null) {
                setLoading(false)
                setLockout(true)
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
                setLockout(true)
                setLoading(false)
                if(res.status == 200) {
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

    return (
        <div>
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
                                return(
                                    <div key={i}>{item} </div>
                                )
                            })}
                        </div>
                    ) : (
                        <h7>Voters not found.</h7>
                    )}
                </Card.Body>

                <Card.Footer>
                    <Button className="mr-3" variant="success" onClick={handleThumbsUp} disabled={lockout}>
                        <HandThumbsUp size={36} />
                    </Button>

                    <Button variant="danger" onClick={handleThumbsDown} disabled={lockout}>
                        <HandThumbsDown size={36} />
                    </Button>
                </Card.Footer>
                
                <Collapse in={loading}>
                    <Card.Footer>
                        <Spinner animation="border" />
                    </Card.Footer>
                </Collapse>
            </Card>
        </div>
    )
}
