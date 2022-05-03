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

  const handleMenuItemClose = (event) => {
    setCategory(event.target.innerText)
  };

  const handleClose = (event) => {
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
        variant="outlined"
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
        <MenuItem onClick={handleMenuItemClose}>Suggested</MenuItem>
        <MenuItem onClick={handleMenuItemClose}>Restaurants</MenuItem>
        <MenuItem onClick={handleMenuItemClose}>Parks</MenuItem>
        <MenuItem onClick={handleMenuItemClose}>Landmarks</MenuItem>
        <MenuItem onClick={handleMenuItemClose}>Shopping</MenuItem>
        <MenuItem onClick={handleMenuItemClose}>Nightlife</MenuItem>
      </Menu>
    </div>
  );
}
