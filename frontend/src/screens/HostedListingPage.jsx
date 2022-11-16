// This is the hosted listing page that when click 'MYlistings' will appear.

import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { navTo, makeRequest } from '../helpers';
import HostListingElement from '../components/HostListingElement';

const HostedListing = (props) => {
  const [Mylistings, setMylistings] = React.useState([]);

  React.useEffect(async () => {
    const newListings = [];
    // everytime access this route, get all the listing info of the current user first
    const data = await makeRequest('/listings', 'GET', undefined, props.token);
    for (let i = 0; i < data.listings.length; i++) {
      if (data.listings[i].owner === props.email) {
        // get the whole info of the listing
        const info = await makeRequest('/listings/' + data.listings[i].id, 'GET', undefined, props.token);
        // get number of total beds
        let totalBeds = 0;
        for (let n = 0; n < info.listing.metadata.bedrooms[1].length; n++) {
          totalBeds += parseInt(info.listing.metadata.bedrooms[1][n]);
        }

        // create a element to mylisting
        newListings.push(<HostListingElement
          title={info.listing.title}
          type={info.listing.metadata.type}
          beds={totalBeds}
          bathrooms={info.listing.metadata.bathrooms}
          thumbnail={info.listing.thumbnail}
          review={info.listing.reviews}
          price={info.listing.price}
          id={data.listings[i].id}
          token={props.token}
          nav={props.nav}
          sethostlistingInfo = {props.sethostlistingInfo}
          published = {info.listing.published}
        />);
      }
    }

    // set the listing to new listing
    setMylistings(newListings);
  }
  , [])

  return (
    <>
      <div>
        <Button style={{ 'margin-left': 10 + 'px', 'margin-top': 10 + 'px' }} size='medium' variant="contained" onClick= { () => { navTo(props.nav, '/hostedListing/createListing') } } >Add listing</Button>
      </div>
      <br />
      <h5>My Listings</h5>

      {Mylistings}
    </>
  );
}

export default HostedListing;

// use for lining purpose
HostedListing.propTypes = {
  nav: PropTypes.func,
  token: PropTypes.string,
  email: PropTypes.string,
  sethostlistingInfo: PropTypes.func
}
