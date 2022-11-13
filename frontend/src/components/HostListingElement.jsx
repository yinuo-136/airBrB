// This is the hosted listings elemenet that will be shown on the hosted page.

import React from 'react';
import PropTypes from 'prop-types';
import { HostListingElementStyle, HostListingtitleStyle } from '../styles/HostListingElemStyle';
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from '@mui/material/Tooltip';
import { makeRequest, navTo } from '../helpers';
import BasicModal from './publishModal';

const HostListingElement = (props) => {
  // this is to handle the modal to open and close
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // set a usestate variable to check the listing is deleted or not
  const [isdeleted, setdeleted] = React.useState(false);

  // delete the listing
  const deleteListing = async () => {
    const data = await makeRequest('/listings/' + props.id, 'DELETE', undefined, props.token);
    if (data) {
      setdeleted(true);
    }
  }

  // jump to edit listing page
  const editListing = async () => {
    const data = await makeRequest('/listings/' + props.id, 'GET', undefined, props.token);
    localStorage.setItem('hostListinginfo' + props.id, JSON.stringify(data.listing));
    navTo(props.nav, '/hostedListing/' + props.id)
  }

  return (
    <>
    {!isdeleted &&
    <HostListingElementStyle>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 + 'px' }}>
        <img src={props.thumbnail} style={{ width: 80 + 'px', height: 80 + 'px' }}></img>
        <div>
        <HostListingtitleStyle>
          <h4>
          {props.title}
        </h4>
        </HostListingtitleStyle>
        <h6>
          type: {props.type}&nbsp;&nbsp; price(per night): {props.price}&nbsp;&nbsp; beds: {props.beds}&nbsp;&nbsp; bathrooms: {props.bathrooms}
        </h6>
        <h6>
          reviews: {props.review.length}
        </h6>
        </div>
      </div>

      <div>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={deleteListing}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit">
          <IconButton aria-label="edit" onClick={editListing}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Publish">
          <IconButton aria-label="upload" onClick={handleOpen}>
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>

        <BasicModal open={open} handleOpen={handleOpen} handleClose={handleClose} id={props.id} token={props.token}/>

      </div>
    </HostListingElementStyle>
    }
    </>
  );
}

export default HostListingElement;

// use for linting purpose
HostListingElement.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  beds: PropTypes.number,
  bathrooms: PropTypes.string,
  thumbnail: PropTypes.string,
  review: PropTypes.array,
  price: PropTypes.string,
  id: PropTypes.number,
  token: PropTypes.string,
  nav: PropTypes.func
}
