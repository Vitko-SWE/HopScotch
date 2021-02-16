import React, { Component } from 'react'
import TripCards from '../TripCard/TripCard'
class homepage extends Component {
    render() {
        return (
            <div style={{height: '100%'}}>
                <main style={{marginTop: '64px'}}>
                    <TripCards/>
                </main>
            </div>
        )
    }
}

export default homepage
