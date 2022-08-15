import { useState, useEffect } from 'react';
import { Review } from './Review'
import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md';
import { Button, Backdrop, Box, Fade, Grid, Link, Typography, Modal, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { borderRadius, flexbox, margin } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ParkIcon from '@mui/icons-material/Park';
import { remove } from '../../../Features/tripSlice';
import { useSelector } from 'react-redux';

const ContainerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: 'center',
  overflowY: 'hidden',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: '12px',
  margin: 0,
};

const AddButton = styled(Button)({
  background: 'linear-gradient(45deg ,#FFC837 30%, #FF8008 90%)',
  border: 0,
  borderRadius: 3,
  color: 'white',
  padding: '5px 10px',
  width: '100%',
  marginTop: '10px'

})

const RemoveButton = styled(Button)({
  background: 'linear-gradient(45deg ,#e53935 30%, #e35d5b 90%)',
  border: 0,
  borderRadius: 3,
  color: 'white',
  padding: '5px 10px',
  width: '100%',
  marginTop: '10px'

})
export const InfoModal = ({ selectedBusiness, setSelectedMarker, addToTrip, removeFromTrip }) => {
  const { name, image_url, price, rating, review_count, categories, url, location, coordinates, id } = selectedBusiness;
  const formattedCategories = categories.map((catergory) => catergory.title).join(" • ");
  const formattedAddress = location.display_address.map((each) => each).join(" ,")
  const description = `${formattedCategories} ${price ? " • " + price : ""
    } • 🎫 • ⭐ ${rating} • ${review_count}+ Reviews`;
  const [reviews, setReviews] = useState([])
  const [open, setOpen] = useState(true);
  const businessesSelected = useSelector((store) => store.trip.businessesSelected)

  const handleClose = () => {
    setOpen(false)
    setSelectedMarker(false);
  }

  const fetchReviews = async (businessID) => {
    await fetch(
      'http://localhost:5000/businesses/' + businessID + '/reviews'
    )
      .then(res => res.json())
      .then(res => setReviews(res.reviews))
  }

  useEffect(() => {
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
        <Box sx={ContainerStyle} >
          <Box
            component="img"
            sx={{
              width: '35vh',
              height: '35vh',
              borderRadius: '10px',
            }}
            alt={name}
            src={image_url}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              m: 3,
              minWidth: { md: 350 },
              height: '35vh',
            }}
          >
            <Box >
              <Typography id="transition-modal-title" variant="h5" component="h2">
                {name}
              </Typography>
              <Typography id="transition-modal-description" variant="subtitle2" sx={{ mt: 0.2 }}>
                <ParkIcon /> {description}
              </Typography>
              <Typography id="transition-modal-description" variant="subtitle1" sx={{ mt: 2 }}>
                <LocationOnIcon /> {formattedAddress}
              </Typography>
            </Box>
            <Box sx={{ overflowY: 'scroll' }}>
              {reviews && (
                <>
                  {reviews.map(review => (

                    <Review review={review} />
                  ))}
                </>
              )}
            </Box>

            <Button
              variant="body2"
              href={url}
              target="_blank"
            >
              <Box
                component="img"
                src='/yelp_logo.png'
                sx={{
                  height: 30,
                  width: 65
                }}
              />
            </Button>
            {
              businessesSelected.some(e => e.id === id)
                ?
                <RemoveButton onClick={() => removeFromTrip(id)} variant='body1'>Remove From Trip</RemoveButton>
                :
                <AddButton onClick={() => addToTrip(coordinates, name, id, image_url)} variant='body1'>Add to Trip</AddButton>
            }

          </Box>
        </Box>
      </Modal>
    </>

    ,
    document.getElementById("portal")
  );
}
