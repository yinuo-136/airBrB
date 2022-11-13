// This is the bedroom input textfields used in both editing and creating listings.

import React from 'react';
import { ListingInputStyle } from '../styles/ListingFormStyle';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const BedRoomInput = (props) => {
  const changeBedroomtype = (event) => {
    props.bedrooms[0][props.brcounter] = event.target.value;
    props.setBedrooms(props.bedrooms);
  }

  const changeBedroombeds = (event) => {
    props.bedrooms[1][props.brcounter] = event.target.value;
    props.setBedrooms(props.bedrooms);
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}><h6>Bedroom{props.brcounter + 1}</h6></div>
      <ListingInputStyle>
        <TextField
          label="bedroom type"
          type="text"
          variant="filled"
          size='small'
          onChange={changeBedroomtype}
        />

        <TextField
          label="number of beds"
          type="number"
          variant="filled"
          size='small'
          onChange={changeBedroombeds}
        />
      </ListingInputStyle>
    </>
  );
}

export default BedRoomInput;

// use for linting purpose
BedRoomInput.propTypes = {
  brcounter: PropTypes.number,
  setBedrooms: PropTypes.func,
  bedrooms: PropTypes.array
}
