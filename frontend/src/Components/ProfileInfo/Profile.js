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


class AccountInformation extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            Name: "",
            Email: "",
            profilePicture: "",
        }

        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleNamechange = this.handleNamechange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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
        this.handleClose()
    }

    handleNamechange (event) {
        this.setState({Name: event.target.value})
        console.log(this.state.Name)
        
    }

    handleEmailChange (event) {
        this.setState({Email: event.target.value})
    }

    handlePictureChange (event) {

    }

    render () {
        return (
            <div className="AccountInfo">
              <h1>Account Info</h1>
              <p>name: {this.state.Name}</p>
              <p>email: {this.state.Email}</p>
              <p>profile pic</p>
              <div className="EditInfo">
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
                          <Form.Group controlId="formBasicName">
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control type="Name" placeholder="New Name" value={this.state.Name} onChange={this.handleNamechange.bind()}/>
                          </Form.Group>
                          <Form.Group>
                              <Form.Label>Email address</Form.Label>
                                  <Form.Control type="email" placeholder="Enter email" value={this.state.Email} onChange={this.handleEmailChange.bind()}/>
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
                      <Button variant="secondary" onClick={this.handleClose.bind()}>
                      Cancel
                      </Button>
                      <Button variant="primary" onClick={this.handleSubmit.bind()}>Save</Button>
                  </Modal.Footer>
                  </Modal>
              </div>
            </div>
          );
    }
}

// const EditInfo = () => {
//     const [show, setShow] = useState(false);
  
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     const handleSubmit = () => {
//         alert("Success")
//         handleClose()
//     }

//     onchange = (event) => {

//     }

//     const handlePictureUpload = () => {

//     }

  
//     return (
//       <div className="AccountInfo">
//         <h1>Account Info</h1>
//         <p>name: jon doe</p>
//         <p>email: jon@gmail.com</p>
//         <p>profile pic</p>
//         <div className="EditInfo">
//             <Button variant="primary" onClick={handleShow}>
//             Edit Account Information
//             </Button>
    
//             <Modal
//             show={show}
//             onHide={handleClose}
//             backdrop="static"
//             keyboard={false}
//             >
//             <Modal.Header closeButton>
//                 <Modal.Title>Edit My Account Infomation</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group controlId="formBasicName">
//                             <Form.Label>Name</Form.Label>
//                             <Form.Control type="Name" placeholder="New Name" />
//                     </Form.Group>
//                     <Form.Group>
//                         <Form.Label>Email address</Form.Label>
//                             <Form.Control type="email" placeholder="Enter email" />
//                             <Form.Text className="text-muted">
//                                 We'll never share your email with anyone else.
//                             </Form.Text>
//                     </Form.Group>

//                         <Form.Group controlId="formBasicPassword">
//                             <Form.Label>Password</Form.Label>
//                             <Form.Control type="password" placeholder="Password" />
//                         </Form.Group>
//                     <Form.Group>
//                         <Form.File id="exampleFormControlFile1" label="Example file input" />
//                     </Form.Group>
                    
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                 Cancel
//                 </Button>
//                 <Button variant="primary" onClick={handleSubmit}>Save</Button>
//             </Modal.Footer>
//             </Modal>
//         </div>
//       </div>
//     );
//   }



export default AccountInformation