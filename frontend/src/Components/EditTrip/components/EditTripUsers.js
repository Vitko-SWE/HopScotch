import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { useHistory } from 'react-router-dom'
import uuid from 'react-uuid';

export default function EditTripUsers(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [userRole, getUserRole] = useState("");
    const [tripUsers, getTripUsers] = useState([]);
    const [tripOwners, getTripOwners] = useState([]);
    const [tripInfo, getTripInfo] = useState({});
    const history = useHistory();

    useEffect (() => {
        updateUserRole()
        updateTripUsers();
        updateTripInfo()
        updateTripOwners()
    }, [])

    const updateUserRole = async () => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
    
        try {
            res = await axios.get(`/api/trips/getuserrole/${props.tripid}/${user.sub}`, {
                headers: {
                  Authorization: token,
                },
              })
    
            if (res.status === 200) {
                getUserRole(res.data[0].Role);
                return res.data
            }
            else {
                console.log(`Error: status ${res.status} ${res.statusText}`)
            }
            
        } catch (error) {
            console.log(error)
        }
      };

      const updateTripUsers = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
          axios.get(`/api/trips/gettripusers/${props.tripid}/all`, {
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

      const updateTripInfo = async () => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
    
        try {
            res = await axios.get(`/api/trips/gettrip/${props.tripid}`, {
                headers: {
                  Authorization: token,
                },
              })
    
            if (res.status === 200) {
                getTripInfo(res.data);
                return res.data
            }
            else {
                console.log(`Error: status ${res.status} ${res.statusText}`)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const updateTripOwners = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
          axios.get(`/api/trips/gettripusers/${props.tripid}/Owner`, {
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

      const handleAddOwners = async (e) => {
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

            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let res = null
        
            try {
                res = await axios.post(`/api/trips/addtripusers/${props.tripid}/Owner`, {
                    users: emails,
                  }, {
                    headers: {
                      Authorization: token,
                    },
                  })
        
                if (res.status === 200) {
                    console.log(res.data);

                    let title = "Trip Participants Update";
                    let body = `New trip owner was added to your ${tripInfo.Name} trip`;
                    postNotification(title, body)
                    window.location.reload()
                    // getTripUsers(res.data);
                    return res.data
                }
                else {
                    alert(`${res.status}: ${res.statusText}\n${res.data}`);
                }
                
            } catch (error) {
                console.log(error)
            }
        //   getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //     axios.post(`/api/trips/addtripusers/${props.tripid}/Owner`, {
        //       users: emails,
        //     }, {
        //       headers: {
        //         Authorization: `Bearer ${res}`,
        //       },
        //     }).then((res) => {
        //       console.log(res.data);
        //       history.push(`/editview/editTripDetails/${props.tripid}`);
        //     }).catch((err) => {
        //       alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        //     });
        //   });
        }
      };
      const handleAddEditors = async (e) => {
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
            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let res = null
        
            try {
                res = await axios.post(`/api/trips/addtripusers/${props.tripid}/Editor`, {
                    users: emails,
                  }, {
                    headers: {
                      Authorization: token,
                    },
                  })
        
                if (res.status === 200) {
                    console.log(res.data);
                    let title = "Trip Participants Update";
                    let body = `New trip editor was added to your ${tripInfo.Name} trip`;
                    postNotification(title, body)
                    window.location.reload()
                    // getTripUsers(res.data);
                    return res.data
                }
                else {
                    alert(`status ${res.status}: ${res.statusText}\n${res.data}`);
                }
                
            } catch (error) {
                console.log(error)
            }
        //   getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //     axios.post(`/api/trips/addtripusers/${props.tripid}/Editor`, {
        //       users: emails,
        //     }, {
        //       headers: {
        //         Authorization: `Bearer ${res}`,
        //       },
        //     }).then((res) => {
        //       console.log(res.data);
        //       history.push(`/edittrip/editTripDetails/${props.tripid}`);
        //     }).catch((err) => {
        //       alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        //     });
        //   });
        }
      };
      const handleAddViewers = async (e) => {
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

            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let res = null
        
            try {
                res = await axios.post(`/api/trips/addtripusers/${props.tripid}/Viewer`, {
                    users: emails,
                  }, {
                    headers: {
                      Authorization: token,
                    },
                  })
        
                if (res.status === 200) {
                    console.log(res.data);
                    let title = "Trip Participants Update";
                    let body = `New trip viewer was added to your ${tripInfo.Name} trip`;
                    postNotification(title, body)
                    window.location.reload()
                    // getTripUsers(res.data);
                    return res.data
                }
                else {
                    alert(`status ${res.status}: ${res.statusText}\n${res.data}`);
                }
                
            } catch (error) {
                console.log(error)
            }
        //   getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //     axios.post(`/api/trips/addtripusers/${props.tripid}/Viewer`, {
        //       users: emails,
        //     }, {
        //       headers: {
        //         Authorization: `Bearer ${res}`,
        //       },
        //     }).then((res) => {
        //       console.log(res.data);
        //       history.push(`/edittrip/editTripDetails/${props.tripid}`);
        //     }).catch((err) => {
        //       alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        //     });
        //   });
        }
      };
      const handleEditUsers = async (e) => {
        e.preventDefault();
        const results = e.currentTarget;
        console.log(results.roleSelectUser.value, results.roleSelectRole.value);
        if (results.roleSelectUser.value === user.sub && userRole === "Owner" && results.roleSelectRole.value !== "Owner" && tripOwners.length === 1) {
          alert("This change cannot be done since you are the sole owner of this trip and all trips must have at least one owner.");
        }
        else {
          if (results.roleSelectRole.value !== "Remove user from trip") {

            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let res = null
        
            try {
                res = await axios.post(`/api/trips/edituserrole/${props.tripid}/${results.roleSelectUser.value}`, {
                    newrole: results.roleSelectRole.value,
                  }, {
                    headers: {
                      Authorization: `Bearer ${res}`,
                    },
                  })
        
                if (res.status === 200) {
                    console.log(res.data);
                    let title = "User Roles Edited";
                    let body = `User roles were edited in your ${tripInfo.Name} trip`;
                    await postNotification(title, body)
                    window.location.reload()
                }
                else {
                    alert(`status ${res.status}: ${res.statusText}\n${res.data}`);
                }
                
            } catch (error) {
                console.log(error)
            }
            // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            //   axios.post(`/api/trips/edituserrole/${props.tripid}/${results.roleSelectUser.value}`, {
            //     newrole: results.roleSelectRole.value,
            //   }, {
            //     headers: {
            //       Authorization: `Bearer ${res}`,
            //     },
            //   }).then((res) => {
            //     console.log(res);
            //     history.push(`/edittrip/editTripDetails/${props.tripid}`);
            //   }).catch((err) => {
            //     alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
            //   });
            // });
          }
          else {

            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let res = null
        
            try {
                res = await axios.delete(`/api/trips/removeuser/${props.tripid}/${results.roleSelectUser.value}`, {
                    headers: {
                      Authorization: token,
                    },
                  })
        
                if (res.status === 200) {
                    console.log(res.data);
                    let title = "Trip Participant Removed";
                    let body = `A trip participant was removed from your ${tripInfo.Name} trip`;
                    postNotification(title, body)
                    
                    window.location.reload()
                }
                else {
                    alert(`status ${res.status}: ${res.statusText}\n${res.data}`);
                }
                
            } catch (error) {
                console.log(error)
            }
            // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            //   axios.delete(`/api/trips/removeuser/${props.tripid}/${results.roleSelectUser.value}`, {
            //     headers: {
            //       Authorization: `Bearer ${res}`,
            //     },
            //   }).then((res) => {
            //     console.log(res);
            //     history.push(`/edittrip/editTripDetails/${props.tripid}`);
            //   }).catch((err) => {
            //     alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
            //   });
            // });
          }
        }
      };

      const deleteTrip = async (e) => {
        e.preventDefault();

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
    
        try {
            res = await axios.delete(`/api/trips/deletetrip/${props.tripid}/`, {
                headers: {
                  Authorization: token,
                },
              })
    
            if (res.status === 200) {
                let title = "Trip Deleted";
                let body = `Your ${tripInfo.Name} was deleted`;
                await postNotification(title, body);
                history.push("/homepage")
            }
            else {
                alert(`status ${res.status}: ${res.statusText}\n${res.data}`);
            }
            
        } catch (error) {
            console.log(error)
        }
        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //   axios.delete(`/api/trips/deletetrip/${props.tripid}/`, {
        //     headers: {
        //       Authorization: `Bearer ${res}`,
        //     },
        //   }).then((res) => {
        //     history.push('/homepage')
        //   });
        // });
      }

      const postNotification = async(title, body) => {

        let users = await getUsers(tripInfo.TripId);
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let promise = null

        console.log("users")
        console.log(users)

        for (let i = 0; i < users.length; i++) {
            let newNotification = {
                UserId: users[i].UserId,
                NotificationTitle: title,
                NotificationBody: body,
                TripName: tripInfo.Name,
                TripId: tripInfo.TripId,
                NotificationId: uuid()
            }

            try {
                promise = await axios.post(`/api/notifications/insertNotification`, newNotification, {
                    headers: {
                        Authorization: token,
                    }
                })

                console.log(" posting Notifications")
            } catch (error) {
                console.log(error)
            }
        }
    }


    const getUsers = async (tripId) => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let promise = null

        promise = await axios.get(`/api/user/getTripUsers/${tripId}`, {
            headers: {
                Authorization: token,
            }
        })

        return promise.data;
    }

      return (
          <div>
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
          </div>

      )
}