import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner, Form, Container, Button, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { Link, useHistory } from 'react-router-dom'
import DatePicker from "react-datepicker";
import TripDetails from './TripDetails'
import EditTripUsers from './EditTripUsers'
import uuid from 'react-uuid';

export default function EditTripDetails(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(true)
    const [userRole, getUserRole] = useState("");
    const [tripInfo, getTripInfo] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const history = useHistory();
    const [spinner, setSpinner] = useState((
        <div>
            <p><strong>Loading...</strong></p>
            <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
      ));

    useEffect (() => {
        updateUserRole()
        updateTripInfo()
    }, [])


    const updateUserRole = async () => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/getuserrole/${props.match.params.tripid}/${user.sub}`, {
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

      const updateTripInfo = async () => {

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/gettrip/${props.match.params.tripid}`, {
                headers: {
                  Authorization: token,
                },
              })

            if (res.status === 200) {
                getTripInfo(res.data);
                setStartDate(new Date(res.data.StartDate.toString()));
                setEndDate(new Date(res.data.EndDate.toString()));
                setLoading(false)
                return res.data
            }
            else {
                console.log(`Error: status ${res.status} ${res.statusText}`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleEditDetails = async (e) => {
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

            let accessToken = null
            accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
            const token = `Bearer ${accessToken}`
            let res = null

            try {
                res = await axios.post(`/api/trips/updatetrip/${props.match.params.tripid}`, {
                    title: results.tripTitle.value,
                    origin: results.tripOrigin.value,
                    destination: results.tripDestination.value,
                    startdate: `${startDate.getFullYear()}-${("00" + (startDate.getMonth() + 1)).slice(-2)}-${("00" + startDate.getDate()).slice(-2)}`,
                    enddate: `${endDate.getFullYear()}-${("00" + (endDate.getMonth() + 1)).slice(-2)}-${("00" + endDate.getDate()).slice(-2)}`,
                  }, {
                    headers: {
                      userid: user.sub,
                      Authorization: token,
                    },
                  })

                if (res.status === 200) {
                    console.log(res);
                    let title = "Trip Details Changed";
                    let body = `Your ${tripInfo.Name} trip details were changed`;
                    await postNotification(title, body);
                    window.location.reload();
                }
                else {
                    alert(`${res.status}: ${res.statusText}\n${res.data}`);
                }
            } catch (error) {
                console.log(error)

            }
        //   getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //     axios.post(`/api/trips/updatetrip/${props.match.params.tripid}`, {
        //       title: results.tripTitle.value,
        //       origin: results.tripOrigin.value,
        //       destination: results.tripDestination.value,
        //       startdate: `${startDate.getFullYear()}-${("00" + (startDate.getMonth() + 1)).slice(-2)}-${("00" + startDate.getDate()).slice(-2)}`,
        //       enddate: `${endDate.getFullYear()}-${("00" + (endDate.getMonth() + 1)).slice(-2)}-${("00" + endDate.getDate()).slice(-2)}`,
        //     }, {
        //       headers: {
        //         userid: user.sub,
        //         Authorization: `Bearer ${res}`,
        //       },
        //     }).then((res) => {
        //       console.log(res);
        //       history.push(`/editview/editTripDetails/${props.match.params.tripid}`);
        //     }).catch((err) => {
        //       alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        //     });
        //   });
        }
      };

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
            <TripDetails tripid={props.match.params.tripid}/>
            <hr/>
            <EditTripUsers tripid={props.match.params.tripid}/>
            {loading ? spinner :
                userRole !== "Viewer" && (
                    <div class="pt-5 pb-5">
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
                                    <Link to={`/editview/${props.match.params.tripid}`}><Button variant="outline-secondary">Cancel</Button></Link>
                                </Form>
                            </div>
                        )}
                    </div>
                )}
          </div>
    )
}
