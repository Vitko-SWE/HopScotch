import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {Card, Container, Jumbotron } from "react-bootstrap"
import planning from "../AgendaView/planning.jpg"

export default function AgendaView(props) {
    const {user, getAccessTokenSilently} = useAuth0();
    // set states of calendar date
    const [calDate, setCalDate] = useState(new Date())
    const [agenda, setAgenda] = useState({
        flights: [],
        features: [],
        dining: []
    })
    const [showAgenda, setShowAgenda] =  useState(false)
    const [flights, setFlights] = useState([])
    const [dining, setDining] = useState([])
    const [features, setFeatures] = useState([])
    const [tripInfo, setTripInfo] = useState({})
    const [tripFeatures, setTripFeatures] = useState({ dining: [], otherFeatures: [] });
    

    useEffect (async () => {
        await getTripInfo()
        await getFlights()
        await getDiningFeatures()
        await getOtherFeatures()
    }, [])

    function onChange (calDate) {
        // change results based on calendar date click
        setCalDate(calDate)

        let todayAgenda = {
            flights: [],
            features: [],
            dining: []
        }
        
        // let features = props.features.otherFeatures

        for (let i = 0; i < flights.length; i++) {
            for (let j = 0; j < flights[i].segments.length; j++) {
                let departureDate = new Date(flights[i].segments[j].departure.at)
                let arrivalDate = new Date(flights[i].segments[j].arrival.at)
                console.log("flight date")
                console.log(departureDate)


                if (departureDate.toDateString() === calDate.toDateString()) {
                    flights[i].segments[j].departure.at = departureDate.toTimeString()
                    flights[i].segments[j].arrival.at = arrivalDate.toTimeString()
                    todayAgenda.flights.push(flights[i].segments[j])
                }
            }
        }

        // let features = props.features.otherFeatures

        for (let i = 0; i < features.length; i++) {
            let date = new Date(features[i].StartDateTime)
            let featureObj = {
                name: "",
                location: "",
                time: ""
            }
           
            if (date.toDateString() === calDate.toDateString()) {
                featureObj.name = features[i].FeatureName
                featureObj.location = features[i].Location
                featureObj.time = date.toTimeString()
                todayAgenda.features.push(featureObj)
            }
        }

        
        for (let i = 0; i < dining.length; i++) {
            let date = dining[i].date
            if (date.toDateString() === calDate.toDateString()) {
                todayAgenda.dining.push(dining[i])
            }
        }


        if (todayAgenda.flights.length === 0 && todayAgenda.features.length === 0 && todayAgenda.dining.length === 0) {
            setShowAgenda(false)
        }
        else {
            setShowAgenda(true)
        }

        setAgenda(todayAgenda)


    }

    const getTripInfo = async () => {

        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null

        try {
            res = await axios.get(`/api/trips/gettrip/${props.match.params.tripid}`, {
                headers: {
                  Authorization: token,
                }
              })
      
              if (res.status === 200) {
                  setTripInfo(res.data)
              }
              else {
                  console.log("Error fetching trip")
              }
        } catch (error) {
            console.log(error)
        }
        
        
      };

    const getFlights = async ()  => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
        
        res = await axios.get(`/api/flights/getFlights/${props.match.params.tripid}`, {
          headers: {
            Authorization: token,
          }
        })

        console.log("flights")
        console.log(res.data)
        console.log(res.status)

        if (res.data !== "") {
            let flightObject = JSON.parse(atob(res.data.FlightData))
            console.log(flightObject)
            setFlights(flightObject.itineraries)
        }

    }


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
            }
            else {
                console.log("Error: Can't fetch features")
            }
            
        } catch (error) {
            console.log(error)
        }


        try {
            res = await axios.get(`/api/features/getConfirmedDiningFeatures/${props.match.params.tripid}`, {
                headers: {
                  Authorization: token,
                }
              })
      
            let diningFeatures = []

            if (res.status === 200) {
    
                for (let i = 0; i < tripFeatures.dining.length; i++) {
                    for (let j = 0; j < res.data.length; j++) {
                        // console.log(props.features.dining[i].id)
                        if (tripFeatures.dining[i].id === res.data[j].FeatureId) {
                            console.log("inside")
                            let date = new Date(res.data[j].StartDateTime)
                            let time = date.toTimeString()
                            let diningObject = {
                                name: tripFeatures.dining[i].name,
                                address: tripFeatures.dining[i].location.address1,
                                city: tripFeatures.dining[i].location.city,
                                phone: tripFeatures.dining[i].display_phone,
                                date: date,
                                time: time,
        
                            }
        
                            diningFeatures.push(diningObject)
                            break;
                        }
                    }
                }
        
                setDining(diningFeatures)
            }
            else {
                console.log("Error: Can't setup dining features")
            }
            
        } catch (error) {
            console.log(error)
        }

    
        
       

    }

    const getOtherFeatures = async () => {
        let accessToken = null
        accessToken = await getAccessTokenSilently({audience: "https://hopscotch/api"})
        const token = `Bearer ${accessToken}`
        let res = null
        
        res = await axios.get(`/api/features/getConfirmedOtherFeatures/${props.match.params.tripid}`, {
          headers: {
            Authorization: token,
          }
        })
        setFeatures(res.data)

        
    }

    return (
        <div >
            {/* <Card> */}
            <Card className="bg-dark text-white">
                <Card.Img src={planning} alt="Card image" style={{height: "12cm"}}/>
                <Card.ImgOverlay>
                    <div className="result-calendar" >
                        <div className="react-calendar" style={{margin: "0 auto", marginTop: "1cm"}} >
                            <Calendar 
                                onChange={onChange} 
                                value={calDate} 
                                // onClickDay={displayClasses1}
                            />
                        </div>
                    </div>
                </Card.ImgOverlay>
                </Card>
            
            
            <div style={{width: "90%", margin: "0 auto", marginTop: "1cm"}}>
                <h1>Agenda for {calDate.toDateString()}</h1>
                <hr/>
                
                {showAgenda ? 
                <div>
                    {agenda.flights.length === 0 ? <></>: 
                        <Jumbotron fluid>
                            <h1>Destination: {tripInfo.Destination}</h1>
                            {agenda.flights.map((item, index) => ( 
                                <Container>
                                <p><b>Departure</b></p>
                                <p><b>Airport: </b>{item.departure.iataCode}</p>
                                <p><b>Terminal: </b>{item.departure.terminal}</p>
                                <p><b>Time: </b> {item.departure.at}</p>
                                <hr/>
                                <p><b>Arrival</b></p>
                                <p><b>Airport: </b>{item.arrival.iataCode}</p>
                                <p><b>Terminal: </b>{item.arrival.terminal}</p>
                                <p><b>Time: </b> {item.arrival.at}</p>
                                <hr/>
                                </Container>
                            ))}
                        </Jumbotron>
                    }
                    {agenda.features.map((item, index) => (
                            <Jumbotron fluid>
                                <Container>
                                <h1>{item.name}</h1>
                                <p><b>Location: </b>{item.location}</p>
                                <p><b>Time: </b>{item.time}</p>
                                </Container>
                            </Jumbotron>
                            
                    ))}
                    {agenda.dining.map((item, index) => (
                            <Jumbotron fluid>
                                <Container>
                                <h1>{item.name}</h1>
                                <p><b>Address: </b>{item.address}</p>
                                <p><b>City: </b>{item.city}</p>
                                <p><b>Phone: </b>{item.phone}</p>
                                <p><b>Time: </b>{item.time}</p>
                                </Container>
                            </Jumbotron> 
                    ))}
                </div> : <div>No Agenda for Today</div>
                }        
            </div>
        </div>
    )
}