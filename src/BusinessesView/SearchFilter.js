//this component will havee "suggested" selected as default in the filter...and provided other filtering options such as food, shopping, etc
//this component shall have a search function for users to find their own places. 
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const SearchFilter =({setSearchCategory}) =>{
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [category, setCategory] = React.useState('Suggested')
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setCategory(event.target.innerText)
    setAnchorEl(null);
  };

  React.useEffect(()=>{
    const temp = (category === 'Suggested') ? 'Tourist' : category;
    setSearchCategory(temp)
  },[category])

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {category}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Suggested</MenuItem>
        <MenuItem onClick={handleClose}>Restaurants</MenuItem>
        <MenuItem onClick={handleClose}>Parks</MenuItem>
        <MenuItem onClick={handleClose}>Landmarks</MenuItem>
        <MenuItem onClick={handleClose}>Shopping</MenuItem>
        <MenuItem onClick={handleClose}>Nightlife</MenuItem>
      </Menu>
    </div>
  );
}
