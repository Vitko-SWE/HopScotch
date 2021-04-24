import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Form, Button, CardDeck } from 'react-bootstrap';
import "./EditTrip.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import VotingCard from "./components/VotingCard";
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaYelp } from 'react-icons/fa'
import Rating from '../Search/Rating'
import Budgeting from "./components/Budgeting";
import uuid from "react-uuid";
import '../EditTrip/EditTrip.css'
import AgendaView from '../AgendaView/AgendaView'
export default function EditTrip(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [tripInfo, getTripInfo] = useState({});
  const [userRole, getUserRole] = useState("");
  const [tripFeatures, setTripFeatures] = useState({ dining: [], otherFeatures: [] });
  const [confirmedFeatures, getConfirmedFeatures] = useState([]);
  const [tripUsers, getTripUsers] = useState([]);
  const [tripOwners, getTripOwners] = useState([]);
  const [tripEditors, getTripEditors] = useState([]);
  const [tripViewers, getTripViewers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [votes, setVotes] = useState([]);
  const [agendaView, setAgendaView] = useState(false)
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      updateTripInfo();
      updateUserRole();
      updateTripUsers();
      updateTripOwners();
      updateTripEditors();
      updateTripViewers();
      updateVotingCards();
      getTripFeatures();
      // updateConfirmedFeatures();
    }, 5000);
  });

  const updateConfirmedFeatures = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/getConfirmedFeatures/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res.data)
        getConfirmedFeatures(res.data)
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  const lockTrip = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post(`/api/trips/lockTrip/${props.match.params.tripid}`, {
        IsLocked: 1
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res);
        history.push(`/edittrip/${props.match.params.tripid}`);
      }).catch((err) => {
        alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
      });
    });
  }

  const unlockTrip = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post(`/api/trips/unlockTrip/${props.match.params.tripid}`, {
        IsLocked: 1
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res);
        history.push(`/edittrip/${props.match.params.tripid}`);
      }).catch((err) => {
        alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
      });
    });
  }

  const updateTripInfo = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/gettrip/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripInfo(res.data);
        setStartDate(new Date(res.data.StartDate.toString()));
        setEndDate(new Date(res.data.EndDate.toString()));
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const updateUserRole = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/getuserrole/${props.match.params.tripid}/${user.sub}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getUserRole(res.data[0].Role);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const updateTripUsers = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/gettripusers/${props.match.params.tripid}/all`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripUsers(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };
  const updateTripOwners = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/gettripusers/${props.match.params.tripid}/Owner`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripOwners(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };
  const updateTripEditors = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/gettripusers/${props.match.params.tripid}/Editor`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripEditors(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };
  const updateTripViewers = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/gettripusers/${props.match.params.tripid}/Viewer`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        getTripViewers(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const updateVotingCards = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then(res => {
      axios.get(`/api/trips/${props.match.params.tripid}/votes`, {
        headers: {
          Authorization: `Bearer ${res}`
        }
      }).then(res => {
        console.log(res.data);
        setVotes(res.data)
      }).catch(err => {
        console.log(err)
      })
    })
  }

  const handleAddOwners = (e) => {
    e.preventDefault();
    const results = e.currentTarget;
    const emails = results.addOwners.value.replace(/\s/g, '').split(",");

    let errors = "";
    if (results.addOwners.value !== "") {
      let valid = true;
      const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] === "" || emails[i] === user.email || !regex.test(emails[i])) {
          valid = false;
        }
      }
      if (!valid) {
        errors += "Please make sure all emails are valid.\n";
      }
    }

    if (errors !== "") {
      alert(errors);
    }
    else {
      getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.post(`/api/trips/addtripusers/${props.match.params.tripid}/Owner`, {
          users: emails,
        }, {
          headers: {
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res.data);
          history.push(`/edittrip/${props.match.params.tripid}`);
        }).catch((err) => {
          alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
  };
  const handleAddEditors = (e) => {
    e.preventDefault();
    const results = e.currentTarget;
    const emails = results.addEditors.value.replace(/\s/g, '').split(",");

    let errors = "";
    if (results.addEditors.value !== "") {
      let valid = true;
      const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] === "" || emails[i] === user.email || !regex.test(emails[i])) {
          valid = false;
        }
      }
      if (!valid) {
        errors += "Please make sure all emails are valid.\n";
      }
    }

    if (errors !== "") {
      alert(errors);
    }
    else {
      getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.post(`/api/trips/addtripusers/${props.match.params.tripid}/Editor`, {
          users: emails,
        }, {
          headers: {
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res.data);
          history.push(`/edittrip/${props.match.params.tripid}`);
        }).catch((err) => {
          alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
  };
  const handleAddViewers = (e) => {
    e.preventDefault();
    const results = e.currentTarget;
    const emails = results.addViewers.value.replace(/\s/g, '').split(",");

    let errors = "";
    if (results.addViewers.value !== "") {
      let valid = true;
      const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] === "" || emails[i] === user.email || !regex.test(emails[i])) {
          valid = false;
        }
      }
      if (!valid) {
        errors += "Please make sure all emails are valid.\n";
      }
    }

    if (errors !== "") {
      alert(errors);
    }
    else {
      getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.post(`/api/trips/addtripusers/${props.match.params.tripid}/Viewer`, {
          users: emails,
        }, {
          headers: {
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res.data);
          history.push(`/edittrip/${props.match.params.tripid}`);
        }).catch((err) => {
          alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
  };
  const handleEditUsers = (e) => {
    e.preventDefault();
    const results = e.currentTarget;
    console.log(results.roleSelectUser.value, results.roleSelectRole.value);
    if (results.roleSelectUser.value === user.sub && userRole === "Owner" && results.roleSelectRole.value !== "Owner" && tripOwners.length === 1) {
      alert("This change cannot be done since you are the sole owner of this trip and all trips must have at least one owner.");
    }
    else {
      if (results.roleSelectRole.value !== "Remove user from trip") {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
          axios.post(`/api/trips/edituserrole/${props.match.params.tripid}/${results.roleSelectUser.value}`, {
            newrole: results.roleSelectRole.value,
          }, {
            headers: {
              Authorization: `Bearer ${res}`,
            },
          }).then((res) => {
            console.log(res);
            history.push(`/edittrip/${props.match.params.tripid}`);
          }).catch((err) => {
            alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
          });
        });
      }
      else {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
          axios.delete(`/api/trips/removeuser/${props.match.params.tripid}/${results.roleSelectUser.value}`, {
            headers: {
              Authorization: `Bearer ${res}`,
            },
          }).then((res) => {
            console.log(res);
            history.push(`/edittrip/${props.match.params.tripid}`);
          }).catch((err) => {
            alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
          });
        });
      }
    }
  };

  const handleEditDetails = (e) => {
    e.preventDefault();
    const results = e.currentTarget;

    let errors = "";

    if (startDate === null || endDate === null) {
      errors += "Please enter a start date and an end date.\n";
    }
    else if (startDate >= endDate) {
      errors += "Please make sure the end date is after the start date.\n";
    }

    if (errors !== "") {
      alert(errors);
    }
    else {
      getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.post(`/api/trips/updatetrip/${props.match.params.tripid}`, {
          title: results.tripTitle.value,
          origin: results.tripOrigin.value,
          destination: results.tripDestination.value,
          startdate: `${startDate.getFullYear()}-${("00" + (startDate.getMonth() + 1)).slice(-2)}-${("00" + startDate.getDate()).slice(-2)}`,
          enddate: `${endDate.getFullYear()}-${("00" + (endDate.getMonth() + 1)).slice(-2)}-${("00" + endDate.getDate()).slice(-2)}`,
        }, {
          headers: {
            userid: user.sub,
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res);
          history.push(`/edittrip/${props.match.params.tripid}`);
        }).catch((err) => {
          alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
  };

  const deleteTrip = (e) => {
    e.preventDefault();
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.delete(`/api/trips/deletetrip/${props.match.params.tripid}/`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        history.push('/homepage')
      });
    });
  }

  const getTripFeatures = () => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/getTripFeatures/${props.match.params.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then(async (res) => {
        console.log(res.data)
        setTripFeatures({ dining: res.data.dining, otherFeatures: res.data.otherFeatures })
        var names = [];
        var addresses = [];
        res.data.otherFeatures.forEach(element => {
          //console.log("other feature address: " + element.Location)
          names.push(element.FeatureName)
          addresses.push(element.Location)
        });
        res.data.dining.forEach(element => {
          //console.log("dining address:  " + element.location.address1 + ", " + element.location.city + ", " + element.location.country)
          names.push(element.name)
          addresses.push(element.location.address1 + ", " + element.location.city + ", " + element.location.country)
        });
        localStorage.setItem('names', names.join("+"))
        localStorage.setItem('addresses', addresses.join("+"))

      }).catch((err) => {
        console.log(err);
      });
    });
  }

  const handleAgendaView = () => {
    setAgendaView(!agendaView)
  }


  return (
    <div>
      {agendaView ? <Button variant="primary" onClick={handleAgendaView}>Switch to edit view</Button> :
        <Button variant="primary" onClick={handleAgendaView}>Switch to agenda view</Button>}

      {agendaView ? <AgendaView features={tripFeatures} tripInfo={tripInfo} /> :
        <div>
          <div class="intro pt-5 pb-5">
            <h1 class="pb-3">{tripInfo.Name}</h1>
            <h3 class="pb-3">Your role: <strong>{userRole}</strong></h3>
            {!tripInfo.IsLocked ?
              <div>
                <Button variant="primary" onClick={() => lockTrip()}>Lock Trip</Button>
              </div>
              :
              <div>
                <Button variant="primary" onClick={() => unlockTrip()}>Unlock Trip</Button>
              </div>
            }

            <br /><br />
            <Link to="/directions"><Button variant="primary">Directions</Button></Link>
            <Container>
              <Row>
                <Col>
                  <p><strong>Origin:</strong> {tripInfo.Origin}</p>
                  <p><strong>Destination:</strong> {tripInfo.Destination}</p>
                  <p><strong>Start Date:</strong> {`${(new Date(tripInfo.StartDate)).getMonth() + 1}/${(new Date(tripInfo.StartDate)).getDate()}/${(new Date(tripInfo.StartDate)).getFullYear()}`}</p>
                  <p><strong>End Date:</strong> {`${(new Date(tripInfo.EndDate)).getMonth() + 1}/${(new Date(tripInfo.EndDate)).getDate()}/${(new Date(tripInfo.EndDate)).getFullYear()}`}</p>
                  <p><strong>Outbound Flight ID:</strong> {tripInfo.OutboundFlightId ? tripInfo.OutboundFlightId : "N/A"}</p>
                  <p><strong>Inbound Flight ID:</strong> {tripInfo.InboundFlightId ? tripInfo.InboundFlightId : "N/A"}</p>
                </Col>
                <Col>
                  <p><strong>Features:</strong> {tripFeatures.dining.length > 0 && tripFeatures.dining.map((item, index) => (
                    <li key={uuid()}>Dining: {item.name}</li>))}
                    {tripFeatures.otherFeatures.length > 0 && tripFeatures.otherFeatures.map((item, index) => (
                      <li key={uuid()}>{item.FeatureType}: {item.FeatureName}</li>))}

                  </p>
                  <p><strong>Locked?</strong> {tripInfo.IsLocked === 0 ? "No" : "Yes"}</p>
                  <p>
                    <strong>Owners:</strong>{" "}
                    {tripOwners.map((owner, i) => (
                      (i !== 0 ? ", " : "") + owner.Name
                    ))}
                  </p>
                  <p>
                    <strong>Editors:</strong>{" "}
                    {tripEditors.length === 0 ? "N/A" : (tripEditors.map((editor, i) => (
                      (i !== 0 ? ", " : "") + editor.Name
                    )))}
                  </p>
                  <p>
                    <strong>Viewers:</strong>{" "}
                    {tripViewers.length === 0 ? "N/A" : (tripViewers.map((viewer, i) => (
                      (i !== 0 ? ", " : "") + viewer.Name
                    )))}
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
          {userRole !== "Viewer" && (
            <div class="pt-5 pb-5">
              {(userRole == "Editor" || userRole == "Owner") && (
                <div>
                  <div>
                    <Budgeting tripFeatures={tripFeatures} tripid={props.match.params.tripid} tripInfo={tripInfo} />
                  </div>
                  <div>
                    <h3>Voting</h3>

                    {votes.length > 0 ? (
                      <CardDeck className="ml-5 mr-5 mt-3 justify-content-center">
                        {votes.map((item, i) => {
                          return (<VotingCard
                            key={i}
                            title={item.FeatureName}
                            type={item.FeatureType}
                            score={item.Score}
                            popularity={item.Popularity}
                            voters={item.Voters.split(",")}
                            tripid={props.match.params.tripid}
                            featureid={item.FeatureId}
                            isflight={item.IsFlight}
                            bookingURL={item.BookingURL}
                            confirmed={item.Confirmed}
                            locked={tripInfo.IsLocked}
                            updateFunc={updateVotingCards}
                          />)
                        })}
                      </CardDeck>
                    ) : (
                      <h6>No votes available. Why not add something?</h6>
                    )}

                    <hr />
                  </div>
                </div>
              )}
              {userRole === "Owner" && !tripInfo.IsLocked && (
                <div>
                  <h3 class="pb-3">Actions</h3>

                  <Container>
                    <Row>
                      <Col>
                        <h5>Add Owners</h5>
                        <Form onSubmit={handleAddOwners}>
                          <Form.Group controlId="addOwners">
                            <Form.Text className="text-muted">
                              Enter email addresses separated by commas.
                      </Form.Text>
                            <Form.Control required />
                          </Form.Group>
                          <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                        <h5>Add Editors</h5>
                        <Form onSubmit={handleAddEditors}>
                          <Form.Group controlId="addEditors">
                            <Form.Text className="text-muted">
                              Enter email addresses separated by commas.
                      </Form.Text>
                            <Form.Control required />
                          </Form.Group>
                          <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                        <h5>Add Viewers</h5>
                        <Form onSubmit={handleAddViewers}>
                          <Form.Group controlId="addViewers">
                            <Form.Text className="text-muted">
                              Enter email addresses separated by commas.
                      </Form.Text>
                            <Form.Control required />
                          </Form.Group>
                          <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                      </Col>
                      <Col>
                        <h5>Edit User Roles</h5>
                        <Form onSubmit={handleEditUsers}>
                          <Form.Group controlId="roleSelectUser">
                            <Form.Text className="text-muted">
                              Select the user that needs to be edited.
                      </Form.Text>
                            <Form.Control as="select">
                              {tripUsers.map((user) => (
                                <option value={user.UserId}>{`${user.Name} (${user.EmailAddress})`}</option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="roleSelectRole">
                            <Form.Text className="text-muted">
                              Select the role the user should be set to.
                      </Form.Text>
                            <Form.Control as="select">
                              <option>Owner</option>
                              <option>Editor</option>
                              <option>Viewer</option>
                              <option>Remove user from trip</option>
                            </Form.Control>
                          </Form.Group>
                          <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                        {tripOwners.find(element => element.sub === user.UserId) && (
                          <div>
                            <h5> Delete trip </h5>
                            <Button variant="danger" onClick={deleteTrip} type="submit">Delete Trip</Button>
                          </div>
                        )}
                      </Col>
                    </Row>
                    <hr />
                  </Container>
                </div>
              )}
              {!tripInfo.IsLocked && (
                <div>
                  <h5>Edit Trip Details</h5>
                  <Form onSubmit={handleEditDetails}>
                    <Container>
                      <Row>
                        <Col>
                          <Form.Group controlId="tripTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required defaultValue={tripInfo.Name} />
                          </Form.Group>
                          <Form.Group controlId="tripOrigin">
                            <Form.Label>Origin</Form.Label>
                            <Form.Control required defaultValue={tripInfo.Origin} />
                          </Form.Group>
                          <Form.Group controlId="tripDestination">
                            <Form.Label>Destination</Form.Label>
                            <Form.Control required defaultValue={tripInfo.Destination} />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="tripStartDate">
                            <Form.Label>Start Date</Form.Label><br />
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="MM/dd/yyyy" />
                          </Form.Group>
                          <Form.Group controlId="tripEndDate">
                            <Form.Label>End Date</Form.Label><br />
                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="MM/dd/yyyy" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Container>
                    <Button variant="primary" type="submit">Submit</Button>
                    {" "}
                    <Link to={`/edittrip/${props.match.params.tripid}`}><Button variant="outline-secondary">Cancel</Button></Link>
                  </Form>
                </div>
              )}
            </div>
          )}
        </div>}
    </div>
  );
};
