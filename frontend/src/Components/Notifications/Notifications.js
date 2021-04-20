import React, { useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Dropdown, Toast, Badge, Alert } from 'react-bootstrap';
import { IoMdNotificationsOutline } from 'react-icons/io'
import axios from 'axios'
import uuid from 'react-uuid'
// import { delete } from '../../../../backend/routes/notifications';

export default function Notifications() {
    const {user, getAccessTokenSilently} = useAuth0();
    const [toast, setToast] = useState([]);
    const [notification, setNotification] = useState([]);
    const [show, setShow] = useState(true)
    const [displayNotification, setDisplayNotification] = useState(false)

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
        setInterval(getNotifications, 60000)
    //   callInit()
    }, [])
    

   

    const getNotifications = async () => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
    
        res = await axios.get(`/api/notifications/getNotifications/${user.sub}`, {
          headers: {
            Authorization: token,
          }
        })

        console.log("in initState")
        console.log(res.data.slice())
        setNotification(res.data.slice())

        if (res.data.length > 0) {
            setDisplayNotification(true)
        }

    }


    const handleToastClose = async (index) => {
        console.log("in handle close")
        let arr = notification.slice()
        arr.splice(index, 1)
        setNotification(arr)


        console.log(notification.length)

        if (arr.length == 0) {
            setDisplayNotification(false)
        }

        deleteNotification(index)
        
    }

    const deleteNotification = async (index) => {
        let notificationId = notification[index].NotificationId;

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
    
        res = await axios.delete(`/api/notifications/deleteNotification/${notificationId}`, {
          headers: {
            Authorization: token,
          }
        })

    }

    return (
        <div>
            <Badge pill variant="dark">
              <Dropdown drop="left" >
                <Dropdown.Toggle as={IoMdNotificationsOutline} size={20} style={{marginTop: "0.25cm", fill: 'white' }}variant="success" >
                </Dropdown.Toggle>
                <span>{notification.length > 0 ? notification.length : <div/>}</span>
                <Dropdown.Menu>
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Divider/>
                {displayNotification ? notification.map((item, index) => ( 
                    <Toast show={true} onClose={() => handleToastClose(index)}>
                    <Toast.Header>
                      <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                      <strong className="mr-auto">{item.NotificationTitle}</strong>
                      <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>{item.NotificationBody}</Toast.Body>
                  </Toast>
                )) : <Alert variant="info">There are no updates at this moment</Alert>}
                </Dropdown.Menu>
              </Dropdown>
            </Badge>
        </div>
    )
}