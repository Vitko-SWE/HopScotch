import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { Container, Pagination } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import SearchFilter from '../Search/components/SearchFilter';
import FlightCard from './components/FlightCard'

export default function FlightSearchResults(props) {
    const [flightItns, setFlightItins] = useState(props.location.state.data.data);
    const { user, getAccessTokenSilently } = useAuth0();
    const [trips, setTrips] = useState([]);
    const [currentPage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pages, setPages] = useState([]);
    const [flightSlice, setFlightSlice] = useState([]);

    useEffect(() => {
        getUserTrips();
        setupPages();
    }, [trips, currentPage]);

    const setupPages = () => {
        const indexOfLastFlight = currentPage * itemsPerPage;
        const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
        setFlightSlice(flightItns.slice(indexOfFirstFlight, indexOfLastFlight));

        var tempPages = []
        for(var i = 1; i <= Math.ceil(flightItns.length/itemsPerPage); i++) {
            tempPages.push(
                <Pagination.Item key={i} active={i == currentPage}>
                    {i}
                </Pagination.Item>
            );
        }

        setPages(tempPages);
    }

    const handlePageTurn = e => {
        setPage(parseInt(e.target.innerText))
    }

    const getUserTrips = () => {
        getAccessTokenSilently({ audience: "https://hopscotch/api" }).then((res) => {
            axios.get('/api/homepage/myTrips', {
                headers: {
                    Authorization: `Bearer ${res}`,
                    userid: user.sub
                }
            }).then(async (res) => {
                await setTrips(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div style={{display: "flex", alignItems: "flex-start"}}>
            <SearchFilter />
            <Container fluid>
            {flightSlice.map((item, i) => {
                return(
                    <FlightCard key={item.id} 
                        itineraries={item.itineraries} 
                        price={item.price} 
                        airlines={item.validatingAirlineCodes}
                        trips={trips}
                        data={item}
                    />
                )
            })}
            <Pagination className="mt-1 justify-content-center" onClick={handlePageTurn}>{pages}</Pagination>
            </Container>
        </div>
    )
}
