import React from 'react'

export default function FlightCard_TripSelectButton(props) {
    const handleClick = e => {
        e.preventDefaults();

        const newFeature = {
            FeatureId: JSON.stringify()
        }
    }

    return (
        <div>
            <Button onClick={handleClick}>I'll take it!</Button>
        </div>
    )
}
