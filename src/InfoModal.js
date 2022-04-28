import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

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

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  background: #FFF;
  padding: 50px;
  zindex: 1000;

`;
const YelpLogo = styled.a`
  <img src="/yelp_logo.png" alt="" />
`

const ModalImage = styled.img`
  width: 100%;
  min-height: auto;
  max-height : 500px;

`;


export const InfoModal =({selectedBusiness})=>{
    const { name, image_url, price, rating, review_count, categories, url, location } =selectedBusiness;
  
    const formattedCategories = categories.map((catergory) => catergory.title).join(" • ");
    const formattedAddress = location.display_address.map((each) =>each).join(" ,")
    console.log(formattedAddress)
  
    const description = `${formattedCategories} ${
      price ? " • " + price : ""
    } • 🎫 • ⭐ ${rating}  (${review_count}+)`;
    return ReactDOM.createPortal(
      <>
      <Background/>
        <ModalWrapper>
          <ModalImage src={image_url}/>

            <h1 > {name}</h1>
            <h2 >{description} </h2>
            <h2> {formattedAddress}</h2>
            <a href={url} target="_blank" rel="noreferrer noopener"><img src="/yelp_logo.png" alt="" /></a>
        </ModalWrapper>

      </>

      ,
      document.getElementById("portal")
    );
  }