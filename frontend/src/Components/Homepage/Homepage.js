import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'
import TripCards from '../TripCard/TripCard'
import axios from "axios";
import Profile from "../ProfileInfo/Profile"

export default function Homepage() {
    const { user, getAccessTokenSilently } = useAuth0();

    
    //If a new user is made, we add them to the database

    getAccessTokenSilently({
        audience: "https://hopscotch/api"

    }).then(res => {

        console.log("token: " + res);
        const headers = {
            "Authorization" : "Bearer " + res,
            // "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI2WXUzbjRKOEVvNnFWU2EyRk9YNSJ9.eyJpc3MiOiJodHRwczovL2ZseWhvcHNjb3RjaC1kZXYudXMuYXV0aDAuY29tLyIsInN1YiI6IkVIenljdVBVbm9vQzNnOVF6UDZoNnlaYjhiZkNqNTJGQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2hvcHNjb3RjaC9hcGkiLCJpYXQiOjE2MTM5NjY0NTIsImV4cCI6MTYxNDA1Mjg1MiwiYXpwIjoiRUh6eWN1UFVub29DM2c5UXpQNmg2eVpiOGJmQ2o1MkYiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.TT3ftAJBPuU3z-58E8GHgEQrOFj3MW3wopDpeo9IlkWMGzvO4_l-OFeT7Ztap4bRnraf03yYZJLQY7UhO0-EKTNAksiU0BACIaXXiviE0O5w8mHnuGsbsm8dEXpM78O9BG5CUuRjXC98mOeM6NKnbW3XnR4G44lBBV5KOvMNBvEld5nZQeFOYeaNxfghO0m0WiA4PaVWss78moLI09hSdxKALCLOzxN9wTtYBdmxGVvc1bsD1JCvVG3IPIFy1EOQK95ZeovrAxrFy6SZJzcyh6-UquDakKaSCBi3pAc848cCLltTQAVOfXCXvT4Og9MDuzH20KxXfPndEHc1AnCJng"
        };
            

        axios.get(`http://localhost:5000/user/getbyuserid/${user.sub}`, {"headers":headers})
        .then( function(res, err) {
            if (err)
                console.log(err);
            else if (res.data.length === 0) {
                const newUser = { userId: `${user.sub}`, name: `${user.name}`, email: `${user.email}`}
                axios.post('http://localhost:5000/user/postnewuser', newUser, {"headers":headers});
            }
        });
    });
    


    return (
        <div style={{height: '100%'}}>
            <main style={{marginTop: '64px'}}>
                <TripCards/>
            </main>
        </div>
    )
}
