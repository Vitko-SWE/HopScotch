import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import uuid from "react-uuid";

export default function Budgeting(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [totals, setTotals] = useState((
    <div></div>
  ));
  const history = useHistory();

  useEffect(() => {
    priceCalculator();
  }, [props.tripfeatures, props.tripInfo]);

  const handleChangeBudget = (e) => {
    e.preventDefault();
    const results = e.currentTarget;

    if (results.budgetChange.value === "" || isNaN(results.budgetChange.value)) {
      alert("Please enter a valid number.");
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
          console.log(err);
          //alert(`${err.response.status}: ${err.response.statusText}\n${err.response.data}`);
        });
      });
    }
  };

  const priceCalculator = () => {
    if (props.tripfeatures.dining.length > 0) {
      let minCount = 0;
      let maxCount = 0;
      for (let i = 0; i < props.tripfeatures.dining.length; i++) {
        if (props.tripfeatures.dining[i].price === "$") {
          minCount += 1;
          maxCount += 10;
        }
        else if (props.tripfeatures.dining[i].price === "$$") {
          minCount += 11;
          maxCount += 30;
        }
        else if (props.tripfeatures.dining[i].price === "$$$") {
          minCount += 31;
          maxCount += 60;
        }
        else if (props.tripfeatures.dining[i].price === "$$$$") {
          minCount += 61;
          maxCount += 100;
        }
      }
      for (let i = 0; i < props.tripfeatures.otherFeatures.length; i++) {
        minCount += props.tripfeatures.otherFeatures[i].Price;
        maxCount += props.tripfeatures.otherFeatures[i].Price;
      }
      setTotals((
        <div>
          <p><strong>Min Estimated Total:</strong> {minCount}</p>
          <p><strong>Max Estimated Total:</strong> {maxCount}</p>
          <p><strong>Budget:</strong> {props.tripInfo.Budget}</p>
        </div>
      ));
    }
    else {
      let count = 0;
      for (let i = 0; i < props.tripfeatures.otherFeatures.length; i++) {
        count += props.tripfeatures.otherFeatures[i].Price;
      }
      setTotals((
        <div>
          <p><strong>Total:</strong> {count}</p>
        </div>
      ));
    }
  };

  return (
    <div>
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
            {props.tripfeatures.dining.length > 0 && props.tripfeatures.dining.map((item, index) => (
              <li key={uuid()}>{item.name}: {item.price}</li>
            ))}
            {props.tripfeatures.otherFeatures.length > 0 && props.tripfeatures.otherFeatures.map((item, index) => (
                <li key={uuid()}>{item.FeatureName}: {item.Price}</li>
            ))}
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
