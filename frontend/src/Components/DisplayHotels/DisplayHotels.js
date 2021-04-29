import { useState, useEffect} from 'react'
import { useAuth0} from "@auth0/auth0-react";
import axios from 'axios'
import { Card, Spinner, Button } from 'react-bootstrap'
import { FaYelp, FaExternalLinkAlt } from 'react-icons/fa';
import hotel_image from "./Hotel_image.jpg"

export default function DisplayHotels(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
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

            if (res.status === 200) {
                setHotels(res.data)
                setLoading(false)
            }
            else {
                console.log("Error: Can't fetch features")
            }
            
        } catch (error) {
            console.log(error)
        }

    }

   return (
       <div>
           {loading ? spinner :
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

                                        {item.confirmed ? <p style={{color:"green"}}>confirmed</p>: <p style={{color:"red"}}>pending</p>}
                                    </Card.Body>
                                    <Button variant="danger">Delete</Button>
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