import React, { useState } from 'react'
import SearchForm from './components/SearchForm'
import { Spinner } from 'react-bootstrap'

export default function FlightSearch() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {!isLoading ? (
                <div>
                    <SearchForm loadingCallback={setIsLoading}/>
                </div>
            ) : (
                <div>
                    <h1>Loading...</h1>
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>

            )}
        </div>
    )
}
