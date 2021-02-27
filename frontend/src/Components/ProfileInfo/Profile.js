import React, { useState, Component } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import { withAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import MenuBar from '../MenuBar/MenuBar'
import '../ProfileInfo/Profile.css'
import { Card, Image, ListGroup, ListGroupItem } from 'react-bootstrap'
import DefaultHead from "./default_head.jpg";
import app from "../../base.js";

class AccountInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show1: false,
            show2: false,
            Name: "",
            Email: "",
            profilePicture: "",
            AboutMe: "",
            selectedFile: null,
            userImage: null,
            user_object: this.props.auth0,
        }

        this.handleShow1 = this.handleShow1.bind(this)
        this.handleClose1 = this.handleClose1.bind(this)
        this.handleShow2 = this.handleShow2.bind(this)
        this.handleClose2 = this.handleClose2.bind(this)
        this.handleNamechange = this.handleNamechange.bind(this)
        this.handleAboutMeChange = this.handleAboutMeChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkPicOnLoad = this.checkPicOnLoad.bind(this)
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
        this.fileUploadHandler = this.fileUploadHandler.bind(this)
        this.getUser = this.getUser.bind(this)
        this.changePassword = this.changePassword.bind(this)
    }


    handleShow1() {
        this.setState({ show1: true })
    }

    handleClose1() {
        this.setState({ show1: false })
    }

    handleShow2() {
        this.setState({ show2: true })
    }

    handleClose2() {
        this.setState({ show2: false })
    }

    handleSubmit() {
        console.log(this.state.Name)
        console.log(this.state.Email)
        this.fileUploadHandler()
        this.updateName()
        this.updateAboutMe()
        this.handleClose1()
    }

    handleNamechange(event) {
        this.setState({ Name: event.target.value })
        console.log(this.state.Name)

    }

    handleAboutMeChange(event) {
        this.setState({ AboutMe: event.target.value })
    }

    checkPicOnLoad() {
        var storageref = app.storage()
        storageref.ref(this.state.user_object.user.sub + `/Profile Picture/picture`).getDownloadURL().then((url) => {
            this.setState({ userImage: url })
            //console.log("On load pic: " + this.state.userImage);
        });
    }

    //upload a photo
    fileSelectedHandler(event) {
        if (event.target.files[0]) {
            this.setState({
                selectedFile: event.target.files[0]
            })
        }
    }

    // //save photo into DB
    fileUploadHandler() {
        var storageref = app.storage()
        console.log("image file: " + this.state.selectedFile)
        if (this.state.selectedFile === null) {
            return
        }
        const uploadTask = storageref.ref(this.state.user_object.user.sub + `/Profile Picture/picture`).put(this.state.selectedFile);
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


    getUser = async () => {
        this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
          const token = `Bearer ${res}`
    
          const api = axios.create({
            baseURL: `http://localhost:5000/user/getbyuserid/${this.state.user_object.user.sub}`,
            headers: {
              Authorization: token
            }
          })
    
          try {
            api.get('/').then(response => {
              console.log(response.data[0])
              this.setState({Name: response.data[0]['Name']})
              this.setState({Email: response.data[0]['EmailAddress']})
              this.setState({AboutMe: response.data[0]['AboutMe']})
            })
          } catch (err) {
            console.log(err)
          }
        })
      }

      updateName = async () => {
        this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
          const token = `Bearer ${res}`
          const api = axios.create({
            baseURL: `http://localhost:5000/user/updateName`,
            headers: {
              userid: this.state.user_object.user.sub,
              name: this.state.Name,
              Authorization: token
            }
          })
    
          try {
            api.post(`http://localhost:5000/user/updateName`).then(response => {
              console.log(response)
            })
          } catch (err) {
            console.log(err)
          }
        })
      }


      updateAboutMe = async () => {
        this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
          const token = `Bearer ${res}`
          const api = axios.create({
            baseURL: `http://localhost:5000/user/updateAboutMe`,
            headers: {
              userid: this.state.user_object.user.sub,
              aboutme: this.state.AboutMe,
              Authorization: token
            }
          })
    
          try {
            api.post(`http://localhost:5000/user/updateAboutMe`).then(response => {
              console.log(response)
            })
          } catch (err) {
            console.log(err)
          }
        })
      }

      changePassword = async () => {
        this.state.user_object.getAccessTokenSilently({audience: "https://hopscotch/api"}).then(res => {
          const token = `Bearer ${res}`
          const api = axios.create({
            headers: {
              email: this.state.user_object.user.email,
              Authorization: token
            }
          })
    
          try {
            api.post(`http://localhost:5000/user/changePassword`).then(response => {
              console.log(response)
            })
          } catch (err) {
            console.log(err)
          }
        })
        window.confirm("A password reset link has been sent to your email at: " + this.state.user_object.user.email);
        this.handleClose2();
      }


    componentDidMount() {
        this.getUser();
        this.checkPicOnLoad();
    }

    render() {
        return (
            <div className="AccountInfo">
                <div className="Profile_Card">
                    <Card >
                        <Image className="circular-pic" src={this.state.userImage || DefaultHead} roundedCircle />
                        <Card.Body>
                            <Card.Title>{this.state.Name}</Card.Title>
                            <Card.Text>
                                Email: {this.state.Email}
                            </Card.Text>
                            <Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem />
                                    <ListGroupItem>{this.state.AboutMe}</ListGroupItem>
                                    <ListGroupItem />
                                </ListGroup>
                            </Card.Body>
                            <Button variant="primary" onClick={this.handleShow1.bind()}>
                                Edit Account Information
                            </Button><br></br><br></br>
                            <Button variant="primary" onClick={this.handleShow2.bind()}>
                                Change Password
                            </Button>


                            {/* Modal 1 for editing account info */}
                            <Modal
                                show={this.state.show1}
                                onHide={this.handleClose1}
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
                                        </Form.Text><br></br>
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
                                            <Form.Label>About Me</Form.Label>
                                            <Form.Control
                                                as="textarea" rows={3}
                                                type="AboutMe" placeholder="Information About Me"
                                                maxlength="200"
                                                value={this.state.AboutMe}
                                                onChange={this.handleAboutMeChange.bind()}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.File variant="primary" id="exampleFormControlFile1" label="Change Profile Picture" onChange={this.fileSelectedHandler.bind()} />
                                        </Form.Group>

                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleClose1.bind()}>
                                        Cancel
                                </Button>
                                    <Button variant="primary" onClick={this.handleSubmit.bind()}>Save</Button>
                                </Modal.Footer>
                            </Modal>


                            {/* Modal 2 for change password */}
                            <Modal
                                show={this.state.show2}
                                onHide={this.handleClose2}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Change Password</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Text className="text-muted">
                                            To change password, please click the button below and access the link sent to your email. Enter your new password at the link provided.
                                        </Form.Text><br></br>
                                        <Button onClick={() => this.changePassword()}>Send Password Reset Link</Button>
                                    </Form.Group>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

export default withAuth0(AccountInformation)