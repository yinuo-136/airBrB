import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { navTo } from '../helpers';

const ListingPage = (props) => {
  const info = props.info;
  // parse address
  const address = info.address;
  const addressString = address.houseNo + ' ' + address.street + ' ' + address.suburb + ' ' + address.city + ' ' + address.state + ' ' + address.country + ', ' + address.postcode;

  // calc number of beds and bedrooms
  const bedrooms = info.metadata.bedrooms[0].length;
  let beds = 0;
  for (let i = 0; i < bedrooms; i++) {
    beds += parseInt(info.metadata.bedrooms[1][i]);
  }

  // get the price per stay value
  let pricePerStay = 0;
  if (info.isUseDate) {
    pricePerStay = info.dateDiff * parseInt(info.price);
  }

  // construct a piclist div
  const picList = [];
  picList.push(<img src={info.thumbnail} style={{ width: 200 + 'px', height: 200 + 'px' }}/>)
  for (let i = 0; i < info.metadata.picList.length; i++) {
    picList.push(<img src={info.metadata.picList[i]} style={{ width: 200 + 'px', height: 200 + 'px' }}/>)
  }

  return (
    <>
      <div><Button
      style={{
        marginLeft: 10 + 'px',
        marginTop: 10 + 'px'
      }}
      size='large'
      variant="contained"
      onClick= { () => { navTo(props.nav, '/') } } >
      Back
      </Button></div>

      <h2 style={{ textAlign: 'center' }}>Listing details</h2>
      <div style={{
        margin: 10 + 'px',
        background: 'white',
        padding: 10 + 'px',
        borderRadius: 10 + 'px'
      }}>
      <h1>Title: {info.title}</h1>
      <h5>Address: {addressString}</h5>
      <h5>Type: {info.metadata.type}</h5>
      <h5>Rooms: {info.metadata.bathrooms} bathroom(s), {bedrooms} bedroom(s) and {beds} bed(s)</h5>
      <h5>Amenities: {info.metadata.amenities}</h5>
      {/* if user did not use date range filter, return price per night, else return price per stay */}
      {!info.isUseDate &&
        <h5>Price per night: {info.price}</h5>
      }
      {info.isUseDate &&
        <h5>Price per stay: {pricePerStay}</h5>
      }
      <h5>Review rating:</h5>
      <h5>Reviews:</h5>
      </div>
      <h2 style={{ textAlign: 'center' }}>Listing house pictures</h2>
      <div style={{
        padding: 3 + 'vw',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 2 + 'vw'
      }}>
        {picList}
      </div>
    </>
  );
}

export default ListingPage;

// use for linting purpose
ListingPage.propTypes = {
  path: PropTypes.string,
  token: PropTypes.string,
  nav: PropTypes.func,
  info: PropTypes.object
}
