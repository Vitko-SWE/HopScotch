import React from 'react'
import PropTypes from 'prop-types';
import { Sun, Search } from "react-bootstrap-icons";
import { Button } from 'react-bootstrap';

import { useDarkMode } from '../DarkMode'
import { useTextMode } from "../TextMode";

export default function AccWidget(props) {
    const darkModeState = useDarkMode()
    const textModeState = useTextMode()

    return (
        <>
            <Button className="mr-1" variant="outline-light" onClick={() => darkModeState.toggle()}>
                <Sun />
            </Button>

            <Button variant="outline-light" onClick={() => textModeState.toggle()}>
                <Search />
            </Button>
        </>
    )
}

AccWidget.propTypes = {
    contrastFunc: PropTypes.func.isRequired,
    textFunc: PropTypes.func.isRequired
}