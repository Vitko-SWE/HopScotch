import React, { Component } from 'react'
import MenuBar from '../MenuBar/MenuBar.js'
import Trip from '../TripCard/TripCard'
class homepage extends Component {
    render() {  
        return (
            <div style={{height: '100%'}}>
                <MenuBar/>
                <main style={{marginTop: '64px'}}>
                    <Trip/>
                </main>
            </div>
        )
    }
}

export default homepage