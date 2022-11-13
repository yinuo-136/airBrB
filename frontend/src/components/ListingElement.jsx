// this is the listing that will be shown on the default screen(dashboard)

import React from 'react';
import PropTypes from 'prop-types';
import { ListingElemStyle } from '../styles/ListingElemStyle';
import Button from '@mui/material/Button';
import { navTo } from '../helpers';

const ListingElement = (props) => {
  // when button is clicked, nav to the listing page with all the details
  const showListingDetails = () => {
    props.setListingInfo(props.info);
    navTo(props.nav, '/Listing/' + props.info.id);
  }

  return (
      <ListingElemStyle>
      <img width={90 + 'px'} height={90 + 'px'} src={props.info.thumbnail} />
      <h5 style={{ textAlign: 'center' }}>{props.info.title}</h5>
      <h5>Reviews: {props.info.reviews.length}</h5>
      <div style={{ float: 'right' }}>
        <Button variant="contained" size="small" onClick={showListingDetails}>More Info</Button>
      </div>
      </ListingElemStyle>
  );
}

export default ListingElement;

ListingElement.propTypes = {
  info: PropTypes.object,
  nav: PropTypes.func,
  setListingInfo: PropTypes.func
}
