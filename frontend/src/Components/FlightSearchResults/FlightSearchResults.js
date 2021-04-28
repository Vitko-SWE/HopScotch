import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Container, Pagination } from 'react-bootstrap';
import SearchFilter from '../Search/Components/SearchFilter';
import FlightCard from './components/FlightCard'

export default function FlightSearchResults(props) {
    const [flightItns, setFlightItns] = useState(props.location.state.data.data);
    const [filteredItns, setFilteredItns] = useState(flightItns);
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
        setFlightSlice(filteredItns.slice(indexOfFirstFlight, indexOfLastFlight));

        var tempPages = []
        for(var i = 1; i <= Math.ceil(filteredItns.length/itemsPerPage); i++) {
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

    const handleFilter = filters => {
        const filtered = flightItns.filter(itn => {
            if(filters.maxPrice == null && filters.minPrice == 0 && filters.maxStops == null) {
                return itn;
            }

            var isValid = true;

            if(filters.minPrice != 0 && itn.price.total < filters.minPrice) {
                isValid = false;
            }

            if(filters.maxPrice != null && itn.price.total > filters.maxPrice) {
                isValid = false;
            }

            if(filters.maxStops != null && itn.itineraries[0].segments.length - 1 > filters.maxStops) {
                isValid = false
            }

            if(filters.maxStops != null && itn.itineraries[1].segments.length - 1 > filters.maxStops) {
                isValid = false
            }

            if(isValid == true) {
                return itn;
            }
        })

        setPage(1);
        setFilteredItns(filtered);
        setupPages();
    }

    const handleSort = sorts => {
        var sorted = null;

        if(sorts.priceSort == "Low to High") {
            sorted = flightItns.sort((a, b) => (a.price.grandTotal > b.price.grandTotal) ? 1 : -1)
        }

        if(sorts.priceSort == "High to Low") {
            sorted = flightItns.sort((a, b) => (a.price.grandTotal < b.price.grandTotal) ? 1 : -1)
        }

        setPage(1);
        setFilteredItns(sorted);
        setupPages();
    }

    return (
        <div style={{display: "flex", alignItems: "flex-start"}}>
            <SearchFilter price stops filterFunc={handleFilter} sortFunc={handleSort} />
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