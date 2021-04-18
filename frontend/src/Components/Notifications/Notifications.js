import React, { useEffect, useState} from 'react';
import { Dropdown, Toast, Badge, Alert } from 'react-bootstrap';
import { IoMdNotificationsOutline } from 'react-icons/io'

export default function Notifications() {
    const [toast, setToast] = useState([]);
    const [notification, setNotification] = useState([]);
    const [show, setShow] = useState(true)
    const [displayNotification, setDisplayNotification] = useState(true)

    const handleShow = () => setShow(false)

    let notif = [
        {
            title: "Flights",
            body: "a flight was added to the trip"
        },
        {
            title: "Dining",
            body: "A resturant feature was added to your israel trip"
        }
    ]

    useEffect (() => {
      initToastStates();
    }, [])

    const initToastStates = () => {
        let toastsStates = [];
        setNotification(notif)
        if (notification.length > 0) {
            setDisplayNotification(true)
        }

    }

    const handleToastClose = (index) => {
        console.log("in handle close")
        console.log(index)
        let toastStates = toast;
        let arr = notification.slice()
        arr.splice(index, 1)
        console.log(arr)
        setNotification(arr)
        console.log(notification.length)

        if (arr.length == 0) {
            setDisplayNotification(false)
        }
        
        // toastStates[index] = false;
        // toast[index] = false;
        // console.log(toastStates)

        // // setToast(toastStates);
        // console.log(toast)
    }

    return (
        <div>
            <Badge pill variant="dark">
              {/* <IoMdNotificationsOutline size={20} style={{marginTop: "0.3cm", fill: 'white' }} />
              <span>9</span> */}
              <Dropdown drop="left" >
                <Dropdown.Toggle as={IoMdNotificationsOutline} size={20} style={{marginTop: "0.25cm", fill: 'white' }}variant="success" >
                </Dropdown.Toggle>
                <span>9</span>
                <Dropdown.Menu>
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Divider/>
                {displayNotification ? notification.map((item, index) => ( 
                    <Toast show={true} onClose={() => handleToastClose(index)}>
                    <Toast.Header>
                      <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                      <strong className="mr-auto">{item.title}</strong>
                      <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>{item.body}</Toast.Body>
                  </Toast>
                )) : <Alert variant="info">There are no updates at this moment</Alert>}
                </Dropdown.Menu>
              </Dropdown>
            </Badge>
        </div>
    )
}