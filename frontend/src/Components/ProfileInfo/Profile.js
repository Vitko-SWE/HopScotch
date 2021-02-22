import React, {useState, Component} from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import MenuBar from '../MenuBar/MenuBar'
import '../ProfileInfo/Profile.css'
import {Card, Image, ListGroup, ListGroupItem} from 'react-bootstrap'
import DefaultHead from "./default_head.jpg";
import app from "../../base.js";


class AccountInformation extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            Name: "",
            Email: "",
            profilePicture: "",
            about_me: "",
            selectedFile: null,
            userImage: null
        }

        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleNamechange = this.handleNamechange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleAboutMeChange = this.handleAboutMeChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkPicOnLoad = this.checkPicOnLoad.bind(this)
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
        this.fileUploadHandler = this.fileUploadHandler.bind(this)
    }


    handleShow () {
        this.setState({show: true})
    }

    handleClose () {
        this.setState({show: false})
    }

    handleSubmit () {
        console.log(this.state.Name)
        console.log(this.state.Email)
        this.fileUploadHandler()
        this.handleClose()
    }

    handleNamechange (event) {
        this.setState({Name: event.target.value})
        console.log(this.state.Name)
        
    }

    handleEmailChange (event) {
        this.setState({Email: event.target.value})
    }

    handleAboutMeChange (event) {
        this.setState({about_me: event.target.value})
    }

    checkPicOnLoad() {
        var storageref = app.storage()
        storageref.ref('TESTING' + `/Profile Picture/picture`).getDownloadURL().then((url) => {
            this.setState({ userImage: url })
            //console.log("On load pic: " + this.state.userImage);
        });
    }

    //upload a photo
    fileSelectedHandler (event){
        if (event.target.files[0]) {
            this.setState({
                selectedFile: event.target.files[0]
            })
        }
    }

    // //save photo into DB
    fileUploadHandler () {
        var storageref = app.storage()
        console.log("image file: " +  this.state.selectedFile)
        if (this.state.selectedFile === null) {
            return
        }
        const uploadTask = storageref.ref('TESTING' + `/Profile Picture/picture`).put(this.state.selectedFile);
        uploadTask.on('state_changed', (snapshot) => {
            console.log(snapshot)
        },
            (error) => {
                console.log("Photo upload error")
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    this.setState({ userImage: url })
                    console.log("New pic here: " + this.state.userImage);
                });
            });

    }

    componentDidMount() {
        this.checkPicOnLoad();
    }

    render () {
        return (
            <div className="AccountInfo">
                <div className="Profile_Card">
                <Card >
                    <Image className="circular-pic" src={this.state.userImage || DefaultHead} roundedCircle/>
                    <Card.Body>
                        <Card.Title>{this.state.Name}</Card.Title>
                        <Card.Text>
                            {this.state.about_me}
                        </Card.Text>
                        <Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem/>
                            <ListGroupItem><li>Email: {this.state.Email}</li></ListGroupItem>
                            <ListGroupItem/>
                        </ListGroup>
                        </Card.Body>
                        <Button variant="primary" onClick={this.handleShow.bind()}>
                            Edit Account Information
                        </Button>
                        <Modal
                            show={this.state.show}
                            onHide={this.handleClose}
                            backdrop="static"
                            keyboard={false}
                            >
                            <Modal.Header closeButton>
                                <Modal.Title>Edit My Account Infomation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Text className="text-muted">
                                        Please enter new information in the following fields.
                                    </Form.Text>
                                    <Form.Group controlId="formBasicName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control 
                                                type="Name" 
                                                placeholder="Enter New Name" 
                                                value={this.state.Name} 
                                                onChange={this.handleNamechange.bind()}
                                            />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                placeholder="Enter New Email" 
                                                value={this.state.Email} 
                                                onChange={this.handleEmailChange.bind()}
                                            />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>About Me</Form.Label>
                                            <Form.Control
                                                as="textarea" rows={3} 
                                                type="about_me" placeholder="Information About Me" 
                                                value={this.state.about_me} 
                                                onChange={this.handleAboutMeChange.bind()}
                                            />
                                    </Form.Group>
                
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Enter New Password" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.File variant="primary" id="exampleFormControlFile1" label="Change Profile Picture" onChange={this.fileSelectedHandler.bind()}/>
                                    </Form.Group>
                                    
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose.bind()}>
                                Cancel
                                </Button>
                                <Button variant="primary" onClick={this.handleSubmit.bind()}>Save</Button>
                            </Modal.Footer>
                        </Modal>
                    </Card.Body>
                </Card>
                </div>
            </div>
          );
    }
}

export default AccountInformation