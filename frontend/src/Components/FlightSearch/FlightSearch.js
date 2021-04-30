import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import SearchForm from './components/SearchForm'
import { Spinner } from 'react-bootstrap'

export default function FlightSearch() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {!isLoading ? (
                <div>
                    <SearchForm loadingCallback={setIsLoading} />
                </div>
            ) : (
                <Spinner animation="border" role="status" variant="primary" className="mt-5">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            )}
        </div>
    )
}
