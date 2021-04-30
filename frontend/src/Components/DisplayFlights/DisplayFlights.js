import { useState, useEffect} from 'react'
import { useAuth0} from "@auth0/auth0-react";
import axios from 'axios'
import { Card, Spinner, Button } from 'react-bootstrap'
import { FaYelp, FaExternalLinkAlt } from 'react-icons/fa';
import ErrorAlert from "../ErrorAlert"
const airlines = require('../FlightSearchResults/airlines.json')


export default function DisplayFlights(props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [flights, setFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [emptyFilights, setEmptyFlights] = useState(false)
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
        await getFlights()
    }, [])

    const getFlights = async ()  => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/flights/getFlights/${props.match.params.tripid}`, {
                headers: {
                  Authorization: token,
                }
            })
      
            console.log("flights")
            console.log(res.data)
            console.log(res.status)
    
            if (res.data !== "") {
                console.log("res data")
                console.log(res.data)
                
                let flightData = JSON.parse(atob(res.data.FlightData))
                let flightObject = {
                    flightData: flightData.itineraries,
                    bookingURL: res.data.bookingURL,
                    confirmed: res.data.Confirmed,
                    airline: res.data.Airline,
                    price: res.data.Price
                }
                // JSON.parse(atob(res.data.FlightData))
    
            
    
                console.log(flightObject)
                setFlights(flightObject)
                setLoading(false)
            }
            else {
                setEmptyFlights(true)
                setMessage("It looks like you do not have any flights at the moment.")
                setLoading(false)
                setShow(true)
            }
            
        } catch (error) {
            setEmptyFlights(true)
            setMessage("It looks like you do not have any flights at the moment.")
            setLoading(false)
            setShow(true)
            console.log(error)
        }
        
        res = await axios.get(`/api/flights/getFlights/${props.match.params.tripid}`, {
          headers: {
            Authorization: token,
          }
        })

        console.log("flights")
        console.log(res.data)
        console.log(res.status)

        if (res.data !== "") {
            console.log("res data")
            console.log(res.data)
            
            let flightData = JSON.parse(atob(res.data.FlightData))
            let flightObject = {
                flightData: flightData.itineraries,
                bookingURL: res.data.bookingURL,
                confirmed: res.data.Confirmed,
                airline: res.data.Airline,
                price: res.data.Price
            }
            // JSON.parse(atob(res.data.FlightData))

        

            console.log(flightObject)
            setFlights(flightObject)
            setLoading(false)
        }
        else {
            setEmptyFlights(true)
            setMessage("It looks like you do not have any flights at the moment.")
            setShow(true)
        }

    }

   return (
       <div>
           {loading ? spinner : emptyFilights ? <ErrorAlert show={show} variant="danger" text={message} closeFunc={() => setShow(false)}/>:
            <div style={{marginRight: "10%", marginLeft: "10%"}}>
                {flights.flightData.length  && (
                    <div className='card-display'>
                        {flights.flightData.map((item, index) =>
                            <Card className="custom_card" style={{ width: '30%' }}>
                                <Card.Img style={{ width: '100%', height: '280px' }} variant="top" src={`/static/airlinelogos/${airlines.find(x => x.code == flights.airline).code}.png`}/>
                                <Card.Body>
                                    <Card.Title>{airlines.find(x => x.code == flights.airline).name}</Card.Title>

                                    <hr />
                                    {/* <Card.Text>{item.Location}</Card.Text> */}
                                    <p style={{color: "green"}}><b>Departure</b></p>
                                    <p style={{textAlign: "left"}}><b>Airport: </b>{item.segments[0].departure.iataCode}</p>
                                    <p style={{textAlign: "left"}}><b>Terminal: </b>{item.segments[0].departure.terminal}</p>
                                    <p style={{textAlign: "left"}}><b>Date: </b>{new Date(item.segments[0].departure.at).toDateString()}</p>
                                    <p style={{textAlign: "left"}}><b>Time: </b> {new Date(item.segments[0].departure.at).toTimeString()}</p>
                                    <hr/>
                                    <p style={{color: "green"}}><b>Arrival</b></p>
                                    <p style={{textAlign: "left"}}><b>Airport: </b>{item.segments[item.segments.length - 1].arrival.iataCode}</p>
                                    <p style={{textAlign: "left"}}><b>Terminal: </b>{item.segments[item.segments.length - 1].arrival.terminal}</p>
                                    <p style={{textAlign: "left"}}><b>Date: </b>{new Date(item.segments[0].arrival.at).toDateString()}</p>
                                    <p style={{textAlign: "left"}}><b>Time: </b> {new Date(item.segments[0].arrival.at).toTimeString()}</p>
                                    <hr/>
                                </Card.Body>
                                <Card.Body>
                                    <a href={flights.bookingURL}>
                                            <FaExternalLinkAlt size={50} style={{fill: 'blue' }} />
                                    </a>
                                    <h3>Booking URL</h3>
                                    {flights.confirmed === "true" ? <p style={{color:"green"}}>confirmed</p>: <p style={{color:"red"}}>pending</p>}
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