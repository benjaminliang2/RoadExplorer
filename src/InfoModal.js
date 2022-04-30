import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md';
import {Button, Backdrop, Box, Fade, Grid, Link, Typography, Modal, Paper} from '@mui/material'; 
import { styled } from '@mui/material/styles';
import { borderRadius, flexbox } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ParkIcon from '@mui/icons-material/Park';

const ContainerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxWidth: { xs: 700, md: 500 },
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 5,
  pt: 3,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',

};
export const InfoModal =({selectedBusiness, setSelectedMarker, addToTrip})=>{
    const { name, image_url, price, rating, review_count, categories, url, location, coordinates, id } =selectedBusiness;
    const formattedCategories = categories.map((catergory) => catergory.title).join(" • ");
    const formattedAddress = location.display_address.map((each) =>each).join(" ,")
    const description = `${formattedCategories} ${
        price ? " • " + price : ""
      } • 🎫 • ⭐ ${rating} • ${review_count}+ Reviews`;
    const [reviews, setReviews] = useState([])
    const [open, setOpen] = useState(true);
    const handleClose = ()=>{
      setOpen(false)
      setSelectedMarker(false);
    }

    const fetchReviews = async (businessID)=>{
        // const response = await fetch('http://localhost:5000/business/' + businessID + '/reviews')
        // const result = await response.json();
        await fetch(
          'http://localhost:5000/businesses/' + businessID + '/reviews'
        )
        .then(res => res.json())
        .then(res => setReviews(res.reviews))

    }
    
    
    const Review = ({review})=>{
      console.log(review)
      const{user, rating, text} = review;
      return(<>
      {/* <h1>single review</h1> */}
        <h1>{user.name} , {rating}</h1> 
        <h3>"{text}"</h3>
    </>)
    }
    useEffect(()=>{
      fetchReviews(id)
      console.log(reviews)
    }, [])

    
  
   
    return ReactDOM.createPortal(
      <>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <Box sx={ContainerStyle}>

              
                <Box
                  component="img"
                  sx={{
                    height: 466,
                    maxHeight: { xs: 466, md: 446 },
                    borderRadius: '10px',
                  }}
                  alt={name}
                  src={image_url}
                />
                <Box >
                  <Typography id="transition-modal-title" variant="h5" component="h2">
                    {name}
                  </Typography>
                  <Typography id="transition-modal-description"  variant ="subtitle2"sx={{ mt: 0.2 }}>
                    <ParkIcon/> {description}
                  </Typography>
                  <Typography id="transition-modal-description" variant ="subtitle1" sx={{ mt: 2 }}>
                    <LocationOnIcon/> {formattedAddress}
                  </Typography>

                  {reviews && (
                    <>
                      <h1>Review go here</h1>
                      {reviews.map(review => (
                        
                        <Review review={review}/>
                      ))}
                    </>
                    

                    
                  )}
                  
                  
                  <Link
                    variant="body2"
                    href={url}
                    target= "_blank"
                  >
                    <Box
                      component = "img"
                      src='/yelp_logo.png'
                      sx={{
                        height: 30,
                        width: 65
                      }}
                    />
                    
                  </Link>
                </Box>

              </Box>


            </Fade>
          </Modal>
      </>

      ,
      document.getElementById("portal")
    );
  }

                {/* <button onClick={()=>setSelectedMarker(null)}>Close </button>
                <h2> {formattedAddress}</h2>
                <a href={url} target="_blank" rel="noreferrer noopener"><img src="/yelp_logo.png" alt="" /></a>
                <button onClick={()=>addToTrip(coordinates, name, id, image_url)}>Add to Trip</button> */}