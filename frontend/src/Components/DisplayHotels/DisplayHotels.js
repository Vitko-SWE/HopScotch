import { useState, useEffect} from 'react'
import { useAuth0} from "@auth0/auth0-react";
import axios from 'axios'
import { Card, Spinner, Button, Alert } from 'react-bootstrap'
import { FaYelp, FaExternalLinkAlt } from 'react-icons/fa';
import hotel_image from "./Hotel_image.jpg"
import ErrorAlert from "../ErrorAlert"

export default function DisplayHotels(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [emptyFeature, setEmptyFeature] = useState(false)
    const [message, setMessage] = useState("")
    const [show, setShow] = useState(false)
    const [spinner, setSpinner] = useState((
        <div>
            <p><strong>Loading...</strong></p>
            <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
      ));

    useEffect (async () => {
        await getHotels()
    }, [])

    const getHotels = async ()  => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/features/getHotelFeatures/${props.match.params.tripid}`, {
                headers: {
                    Authorization: token,
                },
            })

            console.log(res.data)

            if (res.status === 200) {
                setHotels(res.data)
                setLoading(false)

                if (res.data.length === 0) {
                    setEmptyFeature(true)
                    setMessage("It looks like you do not have any hotels at the moment.")
                    setShow(true)
                }
            }
            else {
                console.log("Error: Can't fetch features")
                setLoading(false)
                setEmptyFeature(true)
                setMessage("Oops there was an error getting your dining features")
                setShow(true)
            }
            
        } catch (error) {
            setEmptyFeature(true)
            setMessage("Oops there was an error getting your hotels")
            setLoading(false)
            setShow(true)
            console.log(error)
        }

    }

   return (
       <div>
           {loading ? spinner : emptyFeature ? <ErrorAlert show={show} variant="danger" text={message} closeFunc={() => setShow(false)}/> :
            <div>
                {hotels.length !== 0 && (
                    <div className='card-display'>
                        {hotels.map((item, index) =>
                            <Card className="custom_card" style={{ width: '19%' }}>
                                <Card.Img style={{ width: '100%', height: '280px' }} variant="top" src={hotel_image} />
                                <Card.Body>
                                    <Card.Title>{item.FeatureName}</Card.Title>

                                    <hr />
                                    <Card.Text>{item.Location}</Card.Text>
                                    <hr />
                                    <p style={{textAlign: "left"}}><strong>Planned Check-In Date:</strong>  {new Date(item.StartDateTime).toDateString()}</p>
                                    <p style={{textAlign: "left"}}><strong>Planned Check-In Time:</strong>  {new Date(item.StartDateTime).toTimeString()}</p>
                                    <hr/>
                                    <p style={{textAlign: "left"}}><strong>Planned Check-Out Date:</strong> {new Date(item.EndDateTime).toDateString()}</p>
                                    <p style={{textAlign: "left"}}><strong>Planned Check-Out Time:</strong> {new Date(item.EndDateTime).toTimeString()}</p>
                                    <hr />
                                </Card.Body>
                                <Card.Body>
                                    <Card.Body>
                                        <a href={item.BookingURL}>
                                                <FaExternalLinkAlt size={50} style={{fill: 'blue' }} />
                                        </a>
                                        <h3>Booking URL</h3>

                                        {item.Confirmed == "true" ? <p style={{color:"green"}}>confirmed</p>: <p style={{color:"red"}}>pending</p>}
                                    </Card.Body>
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                )}
            </div>
            }
        </div>
    );

}