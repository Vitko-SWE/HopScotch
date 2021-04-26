import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import uuid from "react-uuid";
import ErrorAlert from "../../ErrorAlert";

export default function Budgeting(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [totals, setTotals] = useState((
    <div></div>
  ));
  const [features, setFeatures] = useState([]);

  const [tripInfo, setTripInfo] = useState({})
  const [tripFeatures, setTripFeatures] = useState({ dining: [], otherFeatures: [] });

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const history = useHistory();

  useEffect(async () => {
    await getDiningFeatures();
    await getTripInfo();
    await updateFeatures();
    await priceCalculator();
  }, []);

  const getDiningFeatures = async ()  => {
    let accessToken = null
    accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
    const token = `Bearer ${accessToken}`
    let res = null

    try {
        res = await axios.get(`/api/trips/getTripFeatures/${props.match.params.tripid}`, {
            headers: {
                Authorization: token,
            },
        })

        if (res.status === 200) {
            setTripFeatures({ dining: res.data.dining, otherFeatures: res.data.otherFeatures })
            return res.data
        }
        else {
            console.log("Error: Can't fetch features")
        }
        
    } catch (error) {
        console.log(error)
    }
  }

  const getTripInfo = async () => {
    try {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

    
        res = await axios.get(`/api/trips/gettrip/${props.match.params.tripid}`, {
            headers: {
              Authorization: token,
            }
          })
  
        if (res.status === 200) {
          let data = res.data
            setTripInfo(data)
            console.log("in trip info")
            console.log(res.data.Budget)
            return res.data
        }
        else {
            console.log("Error: fetching trip")
        }
    } catch (error) {
        console.log(error)
    }
    
    
  };


  const updateFeatures = async (e) => {

    try {
      let accessToken = null
      accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
      const token = `Bearer ${accessToken}`
      let res = null

      res = await axios.get(`/api/trips/getfeaturespure/${props.match.params.tripid}`, {
            headers: {
              Authorization: token,
            },
      })

      let tripFeatures = await getDiningFeatures()

      if (res.status === 200 ) {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].FeatureType === "Dining") {
                  for (let j = 0; j < tripFeatures.dining.length; j++) {
                    if (tripFeatures.dining[j].id === res.data[i].FeatureId) {
                      res.data[i].FeatureName = tripFeatures.dining[j].name;
                      break;
                    }
                  }
                }
              }
              let data = await res.data
              setFeatures(data);
              return res.data
      }
      else {
        console.log(`Error: stutus ${res.status} ${res.statusText} in budgeting`)
      }
    } catch (error) {
      console.log(error)
    }
    
    // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
    //   axios.get(`/api/trips/getfeaturespure/${props.tripid}`, {
    //     headers: {
    //       Authorization: `Bearer ${res}`,
    //     },
    //   }).then((res) => {
    //     for (let i = 0; i < res.data.length; i++) {
    //       if (res.data[i].FeatureType === "Dining") {
    //         for (let j = 0; j < props.tripFeatures.dining.length; j++) {
    //           if (props.tripFeatures.dining[j].id === res.data[i].FeatureId) {
    //             res.data[i].FeatureName = props.tripFeatures.dining[j].name;
    //             break;
    //           }
    //         }
    //       }
    //     }
    //     setFeatures(res.data);
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // });
  };

  const handleChangeBudget = async (e) => {
    e.preventDefault();
    const results = e.currentTarget;

    if (results.budgetChange.value === "" || isNaN(results.budgetChange.value)) {
      setAlertText("Please enter a valid number.");
      setShowAlert(true);
    }
    else {
      try {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

    
        res = await axios.post(`/api/trips/editbudget/${props.match.params.tripid}`, {
                budget: results.budgetChange.value,
              }, {
                headers: {
                  Authorization: token,
                },
              })
  
          if (res.status === 200) {
            console.log(res);
            history.push(`/editview/budgeting/${props.match.params.tripid}`);
          }
          else {
            alert(`${res.status}: ${res.statusText}\n${res.data}`);
            setShowAlert(true);
          }
      } catch (error) {
          console.log(error)
          setShowAlert(true);
      }
    }
      // getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      //   axios.post(`/api/trips/editbudget/${props.tripid}`, {
      //     budget: results.budgetChange.value,
      //   }, {
      //     headers: {
      //       Authorization: `Bearer ${res}`,
      //     },
      //   }).then((res) => {
      //     console.log(res);
      //     history.push(`/edittrip/${props.tripid}`);
      //   }).catch((err) => {
      //     alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
      //   });
      // });
      
  };

  const handleChangeExpenses = async (e) => {
    e.preventDefault();
    const results = e.currentTarget;
    const convData = [];
    for (let i = 0; i < results.length - 2; i++) {
      if (results[i].value === "" || isNaN(results[i].value)) {
        setAlertText("Please enter valid numbers.");
        setShowAlert(true);
        return;
      }
      convData.push({
        id: results[i].id.substring(7),
        price: results[i].value,
      });
    }

    try {
      let accessToken = null
      accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
      const token = `Bearer ${accessToken}`
      let res = null

  
      res = await axios.post(`/api/features/editprices/${props.match.params.tripid}`, {
                input: convData,
              }, {
                headers: {
                  Authorization: token,
                },
            })
          

      if (res.status === 200) {
        console.log(res);
        history.push(`/editview/budgeting${props.match.params.tripid}`);
      }
      else {
        alert(`${res.status}: ${res.statusText}\n${res.data}`);
        setShowAlert(true);
      }
    } catch (error) {
        console.log(error)
        setShowAlert(true);
    }
  
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.post(`/api/features/editprices/${props.tripid}`, {
        input: convData,
      }, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        console.log(res);
        history.push(`/edittrip/${props.tripid}`);
      }).catch((err) => {
        alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
      });
    });
  };

  const priceCalculator = async () => {
    let features = await updateFeatures()
    let tripInfo = await getTripInfo()
   
   
    let count = 0;
    for (let i = 0; i < features.length; i++) {
      count += features[i].Price;
    }

    if (count === tripInfo.Budget) {
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
          <p><strong>Budget:</strong> {tripInfo.Budget}</p>
          <p><strong>You are right on your budget.</strong></p>
        </div>
      ));
    }
    else if (count > tripInfo.Budget) {
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
          <p><strong>Budget:</strong> {tripInfo.Budget}</p>
          <p style={{color: "red"}}><strong>You have exceeded your budget by ${(count - tripInfo.Budget).toFixed(2)}!</strong></p>
        </div>
      ));
    }
    else {
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
          <p><strong>Budget:</strong> {tripInfo.Budget}</p>
          <p style={{color: "green"}}><strong>You are under your budget by ${(tripInfo.Budget - count).toFixed(2)}!</strong></p>
        </div>
      ));
    }
  };


  return (
    <div>
      <ErrorAlert show={showAlert} text={alertText} />
      <h3>Budgeting</h3>
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleChangeBudget}>
              <Form.Group controlId="budgetChange">
                <Form.Label>Edit Overall Budget</Form.Label>
                <Form.Control required defaultValue={tripInfo.Budget} />
              </Form.Group>
              <Button variant="primary" type="submit">Submit</Button>
              {" "}
              <Link to={`/editview/${props.match.params.tripid}`}><Button variant="outline-secondary">Cancel</Button></Link>
            </Form>
          </Col>
          <Col>
            <h5>Expenses</h5>
            <Form onSubmit={handleChangeExpenses}>
              {features.length > 0 && features.map((item, index) => (
                <li key={uuid()}>
                  {item.FeatureName}:{" "}
                  <Form.Group controlId={`expense${item.FeatureId}`}>
                    <Form.Control required defaultValue={item.Price} />
                  </Form.Group>
                </li>
              ))}
              <Button variant="primary" type="submit">Submit</Button>
              {" "}
              <Link to={`/editview/${props.match.params.tripid}`}><Button variant="outline-secondary">Cancel</Button></Link>
            </Form>
          </Col>
          <Col>
            <h5>Totals</h5>
            {totals}
          </Col>
        </Row>
      </Container>
      <hr />
    </div>
  )
}
