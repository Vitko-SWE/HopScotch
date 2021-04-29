import { useState, useEffect} from 'react'
import { useAuth0} from "@auth0/auth0-react";
import axios from 'axios'
import { Card, Spinner, Button } from 'react-bootstrap'
import { FaYelp, FaExternalLinkAlt } from 'react-icons/fa'
export default function DisplayAttractions(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [attraction, setAttractions] = useState([])
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState(new Date())
    const [spinner, setSpinner] = useState((
        <div>
            <p><strong>Loading...</strong></p>
            <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
      ));

    useEffect (async () => {
        await getAttractions()
    }, [])

    const getAttractions = async ()  => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/features/getAttractionFeatures/${props.match.params.tripid}`, {
                headers: {
                    Authorization: token,
                },
            })

            if (res.status === 200) {
                setAttractions(res.data)
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
                {attraction.length !== 0 && (
                    <div className='card-display'>
                        {attraction.map((item, index) =>
                            <Card className="custom_card" style={{ width: '19%' }}>
                                <Card.Img style={{ width: '100%', height: '280px' }} variant="top" src={item.PictureURL} />
                                <Card.Body>
                                    <Card.Title>{item.FeatureName}</Card.Title>

                                    <hr />
                                    <Card.Text>{item.Location}</Card.Text>
                                    <hr />
                                    <p><strong>Date: </strong></p>
                                    <p>Start Time: {item.StartDateTime}</p>
                                    <p>End Time: {item.EndDateTime}</p>
                                    <hr />
                                </Card.Body>
                                <Card.Body>
                                    <a href={item.BookingURL}>
                                            <FaExternalLinkAlt size={50} style={{fill: 'blue' }} />
                                    </a>
                                    <h3>Booking URL</h3>
                                    {item.confirmed ? <p style={{color:"green"}}>confirmed</p>: <p style={{color:"red"}}>pending</p>}
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