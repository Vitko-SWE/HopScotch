import React, { Component } from 'react'
import MenuBar from '../MenuBar/MenuBar.js'
class homepage extends Component {
    render() {
        
        return (
            <div style={{height: '100%'}}>
                <MenuBar/>
                <main style={{marginTop: '64px'}}>
                    <p> Page content here</p>
                </main>
            </div>
        )
    }
}

export default homepage