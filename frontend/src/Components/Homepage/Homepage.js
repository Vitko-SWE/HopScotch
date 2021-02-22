import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'
import TripCards from '../TripCard/TripCard'

export default function Homepage() {
    const { user, getAccessTokenSilently } = useAuth0();

    
    //If a new user is made, we add them to the database

    const token = getAccessTokenSilently();
    console.log(token);
    
    const headers = {'authorization: Bearer' : token};
    fetch(`https://localhost:5000/users/getbyuserid/${user.sub}`, { 
        method: "GET",
        headers: headers 
    })
        .then(response => response.json)
        .then(data => console.log(data));
    


    return (
        <div style={{height: '100%'}}>
            <main style={{marginTop: '64px'}}>
                <TripCards/>
            </main>
        </div>
    )
}
