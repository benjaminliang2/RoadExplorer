import React, { useEffect, useState } from 'react';
// import './SearchResult.css';
// import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
// import StarIcon from '@mui/icons-material/Star';
import './businessCard.css'
export const BusinessCard = (props)=>{

    const {img, title, location, description, star, reviewCount, addToTrip, coordinates, yelpID} = props;
        
    const [isChecked, setIsChecked] = useState(false);
    useEffect(()=>{
        console.log(isChecked)
        addToTrip(isChecked, coordinates, title, yelpID)
    },[isChecked])
    const handleOnChange = ()=>{
        setIsChecked(!isChecked);
    }
    return (
        <>
            <button onClick={()=>addToTrip(title)}>Add to trip</button>
            <div className='searchResult'>
                <img src={img} alt="" />
                {/* <FavoriteBorderIcon className="searchResult__heart" /> */}

                <div className='searchResult__info'>
                    <div className="searchResult__infoTop">
                        <h3>{title}</h3>
                        <p>{location}</p>
                        
                        <p>____</p>
                        <p>{description}</p>
                    </div>

                    <div className="searchResult__infoBottom">
                        <div className="searchResult__stars">
                            {/* <StarIcon className="searchResult__star" /> */}
                            <p>
                                <strong>{star}</strong>
                                <strong>...({reviewCount})</strong>
                            </p>
                        </div>
                        <div className='searchResults__price'>
                            {/* <h2>{price}</h2>
                            <p>{total}</p> */}
                        </div>
                    </div>
                </div>
                <input type="checkbox" checked = {isChecked} onChange={handleOnChange}/>
                {/* <button onClick={()=>{addToTrip(coordinates, title)}}>Add to Trip</button> */}
            </div>
        </>
    )
}

