import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner, Container, Button, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { Link, useHistory } from 'react-router-dom'
import uuid from 'react-uuid';

export default function TripDetails(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(true)
    const [userRole, getUserRole] = useState("");
    const [tripOwners, getTripOwners] = useState([]);
    const [tripEditors, getTripEditors] = useState([]);
    const [tripViewers, getTripViewers] = useState([]);
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
        getTripFeatures();
        updateUserRole()
        updateTripInfo()
        updateTripOwners()
        updateTripViewers()
        updateTripEditors()
    }, [])


    const getTripFeatures = () => {
      getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.get(`/api/trips/getTripFeatures/${props.tripid}`, {
          headers: {
            Authorization: `Bearer ${res}`,
          },
        }).then(async (res) => {
          var names = [];
          var addresses = [];
          res.data.otherFeatures.forEach(element => {
            console.log("other feature address: " + element.Location)
            names.push(element.FeatureName)
            addresses.push(element.Location)
          });
          res.data.dining.forEach(element => {
            console.log("dining address:  " + element.location.address1 + ", " + element.location.city + ", " + element.location.country)
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

    const updateTripOwners = async () => {

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/gettripusers/${props.tripid}/Owner`, {
                headers: {
                  Authorization: token,
                },
              })

            if (res.status === 200) {
                getTripOwners(res.data);
            }
            else {
                console.log (`Error: status ${res.status}; ${res.statusText}`)
            }
        } catch (error) {
            console.log(error)

        }

        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //   axios.get(`/api/trips/gettripusers/${props.tripid}/Owner`, {
        //     headers: {
        //       Authorization: `Bearer ${res}`,
        //     },
        //   }).then((res) => {
        //     getTripOwners(res.data);
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        // });
      };
      const updateTripEditors = async () => {

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/gettripusers/${props.tripid}/Editor`, {
                headers: {
                  Authorization: token,
                },
              })

            if (res.status === 200) {
                getTripEditors(res.data);
            }
            else {
                console.log (`Error: status ${res.status}; ${res.statusText}`)
            }
        } catch (error) {
            console.log(error)

        }
        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //   axios.get(`/api/trips/gettripusers/${props.tripid}/Editor`, {
        //     headers: {
        //       Authorization: `Bearer ${res}`,
        //     },
        //   }).then((res) => {
        //     getTripEditors(res.data);
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        // });
      };
      const updateTripViewers = async () => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/gettripusers/${props.tripid}/Viewer`, {
                headers: {
                  Authorization: token,
                },
              })

            if (res.status === 200) {
                getTripViewers(res.data);
            }
            else {
                console.log (`Error: status ${res.status}; ${res.statusText}`)
            }
        } catch (error) {
            console.log(error)

        }
        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //   axios.get(`/api/trips/gettripusers/${props.tripid}/Viewer`, {
        //     headers: {
        //       Authorization: `Bearer ${res}`,
        //     },
        //   }).then((res) => {
        //     getTripViewers(res.data);
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        // });
      };

      const lockTrip = async () => {

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.post(`/api/trips/lockTrip/${props.tripid}`, {
                IsLocked: 1
              }, {
                headers: {
                  Authorization: token,
                },
              })

            if (res.status === 200) {
                console.log(res);
                let title = "Trip Locked";
                let body = `Your ${tripInfo.Name} was locked`;
                await postNotification(title, body);
                window.location.reload();
            }
            else {
                alert(`${res.status}: ${res.statusText}\n${res.data}`);
            }
        } catch (error) {
            console.log(error)

        }
        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //   axios.post(`/api/trips/lockTrip/${props.tripid}`, {
        //     IsLocked: 1
        //   }, {
        //     headers: {
        //       Authorization: `Bearer ${res}`,
        //     },
        //   }).then((res) => {
        //     console.log(res);
        //     window.location.reload();
        //     // history.push(`/edittrip/editTripDetails/${props.tripid}`);
        //   }).catch((err) => {
        //     alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        //   });
        // });
      }

      const unlockTrip = async () => {

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.post(`/api/trips/unlockTrip/${props.tripid}`, {
                IsLocked: 1
              }, {
                headers: {
                  Authorization: token,
                },
              })

            if (res.status === 200) {
                console.log(res);
                let title = "Trip Unlocked";
                let body = `Your ${tripInfo.Name} was unlocked`;
                await postNotification(title, body);
                window.location.reload();
            }
            else {
                alert(`${res.status}: ${res.statusText}\n${res.data}`);
            }
        } catch (error) {
            console.log(error)

        }
        // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        //   axios.post(`/api/trips/unlockTrip/${props.tripid}`, {
        //     IsLocked: 1
        //   }, {
        //     headers: {
        //       Authorization: `Bearer ${res}`,
        //     },
        //   }).then((res) => {
        //     console.log(res);
        //     window.location.reload();
        //     // history.push(`/edittrip/editTripDetails/${props.tripid}`);
        //   }).catch((err) => {
        //     alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
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
                {/* <p><strong>Features:</strong> {tripFeatures.dining.length > 0 && tripFeatures.dining.map((item, index) => (
                    <li key={uuid()}>Dining: {item.name}</li>))}
                    {tripFeatures.otherFeatures.length > 0 && tripFeatures.otherFeatures.map((item, index) => (
                    <li key={uuid()}>{item.FeatureType}: {item.FeatureName}</li>))}

                </p> */}
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
      )
    }
