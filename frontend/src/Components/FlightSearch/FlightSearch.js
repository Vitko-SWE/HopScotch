import React, { useState } from 'react'
import SearchForm from './components/SearchForm'

export default function FlightSearch() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {!isLoading ? (
                <div>
                    <h1>Flight search goes here...</h1>
                    <SearchForm loadingCallback={setIsLoading}/>
                </div>
            ) : (
                <h1>Loading</h1>
            )}
        </div>
    )
}
