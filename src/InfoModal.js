import React from 'react';
import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md';
import { useSpring, animated } from 'react-spring';
import styled from "styled-components"

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  zindex: 1000
`;

const Modal = styled.div`
  position: fixed;
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  background: #FFF;
  padding: 50px 30px 30px 30px;
  border-radius: 10px;
  zindex: 1000;

`;
const YelpLogo = styled.img`
  width: 100px;
  height: auto;
`

const BusinessImage = styled.img`
  width: 100%;
  min-height: auto;
  max-height : 500px;
  border-radius: 15px;

`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;


export const InfoModal =({selectedBusiness, setSelectedMarker, addToTrip})=>{

    const { name, image_url, price, rating, review_count, categories, url, location, coordinates, id } =selectedBusiness;
  
    const formattedCategories = categories.map((catergory) => catergory.title).join(" • ");
    const formattedAddress = location.display_address.map((each) =>each).join(" ,")
    
    const animation = useSpring({
      config: {
        duration: 250
      },
      opacity: selectedBusiness ? 1 : 0,
      transform: selectedBusiness ? `translateY(0%)` : `translateY(-100%)`
    });
  
    const description = `${formattedCategories} ${
      price ? " • " + price : ""
    } • 🎫 • ⭐ ${rating}  (${review_count}+)`;
    return ReactDOM.createPortal(
      <>
      <Background onClick={()=>setSelectedMarker(null)}/>


          <Modal>
          <CloseModalButton onClick={()=>setSelectedMarker(null)}/>
            <BusinessImage src={image_url}/>
            <h1 > {name}</h1>
            <h2 >{description} </h2>
            <h2> {formattedAddress}</h2>
            <a href={url} target="_blank" rel="noreferrer noopener"><YelpLogo src="/yelp_logo.png" alt="" /></a>
            <button onClick={()=>addToTrip(coordinates, name, id, image_url)}>Add to Trip</button>
          </Modal>
      </>

      ,
      document.getElementById("portal")
    );
  }
