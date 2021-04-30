import { useState, useEffect} from 'react'
import { useAuth0} from "@auth0/auth0-react";
import axios from 'axios'
import { Card, Spinner, Button, Alert } from 'react-bootstrap'
import Rating from '../Search/Rating'
import { FaYelp } from 'react-icons/fa';
// import SelectTripDropdown from '../../SelectTripDropdown';
import ErrorAlert from "../ErrorAlert"

export default function DisplayDiningFeatures(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [dining, setDining] = useState([])
    const [tripFeatures, setTripFeatures] = useState({ dining: [], otherFeatures: [] });
    const [loading, setLoading] = useState(true)
    const [emptyFeature, setEmptyFeatures] = useState(false)
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState("")
    const [spinner, setSpinner] = useState((
        <div>
            <p><strong>Loading...</strong></p>
            <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
      ));

    useEffect (async () => {
        await getDiningFeatures()
    }, [])

    const getDiningFeatures = async ()  => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/getTripFeatures/${props.match.params.tripid}`, {
                headers: {
                    Authorization: token,
                },
            })

            if (res.status === 200) {
                setTripFeatures({ dining: res.data.dining, otherFeatures: res.data.otherFeatures })
                setLoading(false)
            }
            else {
                console.log("Error: Can't fetch features")
                setEmptyFeatures(true)
                setLoading(false)
                setShow(true)
            }
            
        } catch (error) {
            setLoading(false)
            setEmptyFeatures(true)
            setShow(true)
            setMessage("It looks like you do not have any dining features at the moment")
            console.log(error)
        }

    }

   return (
       <div>
           {loading ? spinner : emptyFeature ? <ErrorAlert show={show} variant="danger" text={message} closeFunc={() => setShow(false)}/>:
            <div>
                {tripFeatures.dining.length !== 0 && (
                    <div className='card-display'>
                        {tripFeatures.dining.map((item, index) =>
                            <Card className="custom_card" style={{ width: '19%' }}>
                                <Card.Img style={{ width: '100%', height: '280px' }} variant="top" src={item.image_url} />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        <Rating rating={item.rating} />
                                        <Card.Text className="text-muted">{item.review_count} reviews</Card.Text>
                                    </Card.Text>

                                    <hr />

                                    {item.price ? (
                                        <Card.Text> <strong>Price:</strong> {item.price}</Card.Text>
                                    ) : (
                                        <Card.Text>Pricing data not supplied. Contact the business directly.</Card.Text>
                                    )}

                                    <hr />

                                    <Card.Text>{item.location.address1}, {item.location.city}, {item.location.state}</Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Body>
                                        <a style={{ textDecoration: 'none', color: '#000' }} href={item.url} target="_blank">
                                            <FaYelp size={50} style={{ fill: 'red' }} />
                                            <h1>Yelp</h1>
                                            <p>Read more on Yelp</p>
                                        </a>
                                        {item.confirmed ? <p style={{color:"green"}}>confirmed</p>: <p style={{color:"red"}}>pending</p>}
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