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

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const history = useHistory();

  useEffect(() => {
    priceCalculator();
    updateFeatures();
  }, [props.tripFeatures, props.tripInfo]);

  const updateFeatures = (e) => {
    getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
      axios.get(`/api/trips/getfeaturespure/${props.tripid}`, {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].FeatureType === "Dining") {
            for (let j = 0; j < props.tripFeatures.dining.length; j++) {
              if (props.tripFeatures.dining[j].id === res.data[i].FeatureId) {
                res.data[i].FeatureName = props.tripFeatures.dining[j].name;
                break;
              }
            }
          }
        }
        setFeatures(res.data);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  const handleChangeBudget = (e) => {
    e.preventDefault();
    const results = e.currentTarget;

    if (results.budgetChange.value === "" || isNaN(results.budgetChange.value)) {
      setAlertText("Please enter a valid number.");
      setShowAlert(true);
    }
    else {
      getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
        axios.post(`/api/trips/editbudget/${props.tripid}`, {
          budget: results.budgetChange.value,
        }, {
          headers: {
            Authorization: `Bearer ${res}`,
          },
        }).then((res) => {
          console.log(res);
          history.push(`/edittrip/${props.tripid}`);
        }).catch((err) => {
          setAlertText(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
          setShowAlert(true);
        });
      });
    }
  };

  const handleChangeExpenses = (e) => {
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
        setAlertText(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        setShowAlert(true);
      });
    });
  };

  const priceCalculator = () => {
    let count = 0;
    for (let i = 0; i < features.length; i++) {
      count += features[i].Price;
    }

    if (count === props.tripInfo.Budget) {
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
          <p><strong>Budget:</strong> {props.tripInfo.Budget}</p>
          <p><strong>You are right on your budget.</strong></p>
        </div>
      ));
    }
    else if (count > props.tripInfo.Budget) {
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
          <p><strong>Budget:</strong> {props.tripInfo.Budget}</p>
          <p style={{color: "red"}}><strong>You have exceeded your budget by ${(count - props.tripInfo.Budget).toFixed(2)}!</strong></p>
        </div>
      ));
    }
    else {
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
          <p><strong>Budget:</strong> {props.tripInfo.Budget}</p>
          <p style={{color: "green"}}><strong>You are under your budget by ${(props.tripInfo.Budget - count).toFixed(2)}!</strong></p>
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
                <Form.Control required defaultValue={props.tripInfo.Budget} />
              </Form.Group>
              <Button variant="primary" type="submit">Submit</Button>
              {" "}
              <Link to={`/edittrip/${props.tripid}`}><Button variant="outline-secondary">Cancel</Button></Link>
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
              <Link to={`/edittrip/${props.tripid}`}><Button variant="outline-secondary">Cancel</Button></Link>
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
  );
}
