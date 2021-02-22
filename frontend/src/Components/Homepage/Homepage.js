import React, { Component } from 'react'
import MenuBar from '../MenuBar/MenuBar.js'
import TripCards from '../TripCard/TripCard'
class homepage extends Component {
    render() {  
        return (
            <div style={{height: '100%'}}>
                {/* <MenuBar/> */}
                <main style={{marginTop: '64px'}}>
                    <TripCards/>
                </main>
            </div>
        )
    }
}

export default homepage