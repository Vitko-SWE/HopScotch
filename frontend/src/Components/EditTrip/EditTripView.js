import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'
import { Container, Row, Col, Button, Badge, Card, ButtonGroup, Dropdown, DropdownButton} from 'react-bootstrap'
import flight_wallpaper from './flight_wallpaper.jpg'
import { FiEdit3 } from 'react-icons/fi';
import { IoRestaurantSharp, IoTicketOutline } from 'react-icons/io5'
import { MdFlight, MdDirectionsCar} from 'react-icons/md'
import { GrAttraction } from 'react-icons/gr'
import {FaHotel } from 'react-icons/fa'
import { BiDollarCircle } from 'react-icons/bi'
import { GiVote } from 'react-icons/gi'
import { SiGooglecalendar } from 'react-icons/si'
import { Link } from "react-router-dom";
export default function EditTripView (props) {
    const {user, getAccessTokenSilently} = useAuth0();
    const [tripInfo, setTripInfo] = useState({})

    useEffect (async () => {
        getTripInfo()
    }, [])

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


    return (
        <div style={{height: 0, paddingBottom: "56.25%", position: "relative"}}>
            <Card className="bg-dark text-white">
                <Card.Img src={flight_wallpaper} alt="Card image" style={{ postion: "absolute", top: "0", left: "0", width: "100%", height: "100%"}}/>
                <Card.ImgOverlay>
                    <Card.Title><h1>{tripInfo.Destination}</h1></Card.Title>
                    <Card style={{width: "8cm", backgroundColor: "rgba(0,0,0,1)"}}>
                    <ButtonGroup vertical>
                        <Link to={`/editview/editTripDetails/${props.match.params.tripid}`}>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><FiEdit3 size={22}/></Badge>  Edit Trip Details/Users</strong>
                            </Button>
                        </Link>
                        <Link to={`/editview/vote/${props.match.params.tripid}`}>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><GiVote size={22}/></Badge> Vote On Trip Features</strong>
                            </Button>
                        </Link>
                        <Link to={`/editview/budgeting/${props.match.params.tripid}`}>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong> <Badge variant="dark"><BiDollarCircle size={22}/></Badge>  Trip Budget</strong>
                            </Button>
                        </Link>
                        <Link to={`/agendaView/${props.match.params.tripid}`} >
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><SiGooglecalendar size={22}/></Badge> Agenda View</strong>
                            </Button>
                        </Link>
                        <Link>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><MdFlight size={22}/></Badge>  Flight Details</strong>
                            </Button>
                        </Link>
                        <Link to={`/editview/attractions/${props.match.params.tripid}`}>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><IoTicketOutline size={22} color="white"/></Badge>  Attraction Details </strong>
                            </Button>
                        </Link>
                        <Link to={`/editview/hotels/${props.match.params.tripid}`}>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><FaHotel size={22}/></Badge> Hotel Details</strong>
                            </Button>
                        </Link>
                        <Link to={`/editview/diningDetails/${props.match.params.tripid}`}>
                            <Button variant="outline-light" size="lg" style={{width: "8cm"}} className="primary-btn col-xs-11 text-left">
                                <strong><Badge variant="dark"><IoRestaurantSharp size={22}/></Badge>  Food Details</strong>
                            </Button>
                        </Link>

                        
                    </ButtonGroup>

                    </Card>
                    
                    {/* <Card.Text>
                    <strong>{Math.ceil((new Date(tripInfo.StartDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days Left</strong>
                    </Card.Text>
                    <Card.Text>Last updated 3 mins ago</Card.Text> */}
                </Card.ImgOverlay>
            </Card>
            {/* <Container fluid style={{width: "70%", height: "10cm"}}>
                <Row style={{marginTop: "1cm"}}>
                    <Col>
                        <Link to={`/editview/vote/${props.match.params.tripid}`}>
                            <Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge variant="dark"><GiVote size={22}/></Badge> Vote On Trip Features</strong></Button>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={`/editview/editTripDetails/${props.match.params.tripid}`}>
                            <Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge variant="dark"><FiEdit3 size={22}/></Badge>  Edit Trip Details/Users</strong></Button>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={`/agendaView/${props.match.params.tripid}`}><Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge variant="dark"><SiGooglecalendar size={22}/></Badge> Agenda View</strong></Button></Link>
                    </Col>
                </Row>
                <Row style={{marginTop: "2cm"}}>
                    <Col>
                        <Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge variant="dark"><MdFlight size={22}/></Badge>  Flight Details</strong></Button>
                    </Col>
                    <Col>
                        <Button variant="outline-info" size="lg" style={{width: "8cm"}}>
                            <strong> <Badge variant="dark"><MdDirectionsCar size={22}/></Badge> Transportation Details</strong>
                        </Button>
                    </Col>
                    <Col>
                        <Link to={`/editview/budgeting/${props.match.params.tripid}`}>
                            <Button variant="outline-info" size="lg" style={{width: "8cm"}}>
                                <strong> <Badge variant="dark"><BiDollarCircle size={22}/></Badge>  Trip Budget</strong>
                            </Button>
                        </Link>
                    </Col>
            
                </Row >
                <Row style={{marginTop: "2cm"}}>
                    <Col>
                        <Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge variant="dark"><FaHotel size={22}/></Badge> Hotel Details</strong></Button>
                    </Col>
                    <Col>
                        <Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge ><GrAttraction size={22} /></Badge>  Attraction Details </strong></Button>
                    </Col>
                    <Col>
                        <Button variant="outline-info" size="lg" style={{width: "8cm"}}><strong><Badge variant="dark"><IoRestaurantSharp size={22}/></Badge>  Food Details</strong></Button>
                    </Col>
                </Row>
            </Container> */}
        </div>
    )
}