import React, { useEffect, useState, useRef } from 'react';
import StarRateIcon from '@mui/icons-material/StarRate';
import Button from '@mui/material/Button';
// import './SearchResult.css';
// import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
// import StarIcon from '@mui/icons-material/Star';
import './businessCard.css'
export const BusinessCard = (props)=>{

    const {img, index, name, location, description, star, reviewCount, addToTrip, setActiveMarker,  coordinates, yelpID} = props;
        
    // const [isChecked, setIsChecked] = useState(false);
    // const isMounted = useRef(false)

    // useEffect(()=>{
    //     if (isMounted.current) {
    //         addToTrip(isChecked, coordinates, title, yelpID)
    //     }
    // },[isChecked])

    // useEffect(()=>{
    //     isMounted.current = true;
    //   },[])
      
    const handleOnClick= ()=>{
        // setIsChecked(!isChecked);
        addToTrip(coordinates, name, yelpID, img);
    }
    return (
        <>

            <div className='searchResult' onMouseEnter={()=>setActiveMarker({id: yelpID})} onMouseLeave={()=>setActiveMarker({id: 'none'})}>
                
                <div className="searchResult__image">
                    <img src={img} alt="" />
                </div>
                {/* <FavoriteBorderIcon className="searchResult__heart" /> */}

                <div className='searchResult__info'>
                    <div className="searchResult__infoTop">
                        <h3>{index + 1}. {name}</h3>
                        <p>{description}</p>
                        <p>{location}</p>                    

                    </div>

                    <div className="searchResult__infoBottom">
                        <div className="searchResult__stars">
                            {/* <StarIcon className="searchResult__star" /> */}
                            <p>
                                {star} <StarRateIcon sx={{'verticalAlign': 'bottom'}}/>
                                {reviewCount} + Reviews
                            </p>
                        </div>
                        <div className='searchResults__price'>
                            {/* <h2>{price}</h2>
                            <p>{total}</p> */}
                        </div>
                    </div>
                </div>
                {/* <input type="checkbox" checked = {isChecked} onChange={handleOnChange}/> */}
                <Button sx={{'height': 'auto'}} variant="contained" onClick={handleOnClick}>Add to Trip</Button>
            </div>
        </>
    )
}

