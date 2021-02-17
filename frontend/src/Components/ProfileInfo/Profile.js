import {React, useState} from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import MenuBar from '../MenuBar/MenuBar'
import '../ProfileInfo/Profile.css'


const EditInfo = () => {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  
    return (
      <div className="AccountInfo">
        <h1>Account Info</h1>
        <p>name: jon doe</p>
        <p>email: jon@gmail.com</p>
        <p>profile pic</p>
        <div className="EditInfo">
            <Button variant="primary" onClick={handleShow}>
            Edit Account Information
            </Button>
    
            <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            >
            <Modal.Header closeButton>
                <Modal.Title>Edit My Account Infomation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="Name" placeholder="New Name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                    </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                    <Form.Group>
                        <Form.File id="exampleFormControlFile1" label="Example file input" />
                    </Form.Group>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Cancel
                </Button>
                <Button variant="primary">Save</Button>
            </Modal.Footer>
            </Modal>
        </div>
      </div>
    );
  }



export default EditInfo