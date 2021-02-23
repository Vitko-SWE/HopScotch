import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';

export default function LoginButton(props) {
    const { loginWithRedirect } = useAuth0();

    return <Button onClick={() => loginWithRedirect({ redirectUri: window.location.origin + "/homepage" })}>{props.btntext}</Button>
}
