import React from 'react'
import { Container, Row } from 'react-bootstrap';
import StickyBox from "react-sticky-box";

export default function SearchFilter() {
    return (
        <StickyBox className="mt-5" offsetTop={20} offsetBottom={20} style={{ border: '1px solid gray', borderRadius: '5px' }}>
            <Container className="m-3 mr-5">
                <Row>
                    <h1>Filter</h1>
                </Row>
            </Container>
        </StickyBox>
    )
}
