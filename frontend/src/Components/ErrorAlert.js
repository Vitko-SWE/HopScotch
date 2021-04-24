import React, { useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'

export default function ErrorAlert(props) {
    return (
        <Alert show={props.show} variant="danger" className="position-absolute" style={{ bottom: 0, right: 10 }} dismissible>
            {props.text}
        </Alert>
    )
}
