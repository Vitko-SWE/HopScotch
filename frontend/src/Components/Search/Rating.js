import React, { useEffect, useState} from 'react';
import {Card} from "react-bootstrap"
import zero_stars from '../../Yelp/Yelp_stars/small/small_0.png'
import one_star from '../../Yelp/Yelp_stars/small/small_1.png'
import one_half_stars from '../../Yelp/Yelp_stars/small/small_1_half.png'
import two_stars from '../../Yelp/Yelp_stars/small/small_2.png'
import two_half_star from '../../Yelp/Yelp_stars/small/small_2_half.png'
import three_stars from '../../Yelp/Yelp_stars/small/small_3.png'
import three_half_star from '../../Yelp/Yelp_stars/small/small_3_half.png'
import four_stars from '../../Yelp/Yelp_stars/small/small_4.png'
import four_half_star from '../../Yelp/Yelp_stars/small/small_4_half.png'
import five_star from '../../Yelp/Yelp_stars/small/small_5.png'


export default function Rating(props) {
    if (props.rating === 0) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={zero_stars} />
    }
    else if (props.rating === 1) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={one_star} />
    }
    else if (props.rating > 1 && props.rating < 2) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={one_half_stars} />
    }
    else if (props.rating === 2) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={two_stars} />
    }
    else if (props.rating > 2 && props.rating < 3) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={two_half_star} />
    }
    else if (props.rating === 3) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={three_stars} />
    }
    else if (props.rating > 3 && props.rating < 4) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={three_half_star} />
    }
    else if (props.rating === 4) {
        return <Card.Img style={{width: '150px', height: '25px'}} src={four_stars} />
    }
    else if (props.rating > 4 && props.rating < 5) {
        return <Card.Img  style={{width: '150px', height: '25px'}} src={four_half_star} />
    }
    else if (props.rating === 5) {
        return <Card.Img  style={{width: '150px', height: '25px'}} src={five_star} />
    }

    return <Card.Img  style={{width: '150px', height: '25px'}} src={zero_stars} />

}