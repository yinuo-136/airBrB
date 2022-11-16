import React from 'react';
import PropTypes from 'prop-types';
import { BookingRequestStyle } from '../styles/BookingElementStyle';
import Button from '@mui/material/Button';
import { makeRequest } from '../helpers';

const BookingRequest = (props) => {
  const [isconfirmed, setConfirmed] = React.useState(false);
  // handle accept booking
  const acceptHandler = async () => {
    const data = await makeRequest('/bookings/accept/' + props.bookingInfo.id, 'PUT', undefined, props.token);
    if (data) {
      setConfirmed(true);
      props.setDoneListingOp(Math.random());
    }
  }

  // handle deny booking
  const denyHandler = async () => {
    const data = await makeRequest('/bookings/decline/' + props.bookingInfo.id, 'PUT', undefined, props.token);
    if (data) {
      setConfirmed(true);
      props.setDoneListingOp(Math.random());
    }
  }
  return (
    <>
    {!isconfirmed &&
    <BookingRequestStyle>
    <h6>Id: {props.bookingInfo.id}&nbsp;
        Price: ${props.bookingInfo.totalPrice}&nbsp;
        From: {props.bookingInfo.dateRange.startdd}/{props.bookingInfo.dateRange.startmm}/{props.bookingInfo.dateRange.startyy}&nbsp;
        To: {props.bookingInfo.dateRange.enddd}/{props.bookingInfo.dateRange.endmm}/{props.bookingInfo.dateRange.endyy}&nbsp;
    </h6>
    <div>
    <Button variant="contained" size="small" onClick={acceptHandler}>accept</Button>
    &nbsp;&nbsp;
    <Button variant="contained" color="error" size="small" onClick={denyHandler}>deny</Button>
    </div>
    </BookingRequestStyle>
    }
    </>
  );
}

export default BookingRequest;

// use for linting purpose
BookingRequest.propTypes = {
  bookingInfo: PropTypes.object,
  token: PropTypes.string,
  setDoneListingOp: PropTypes.func
}
