import React from 'react';
import PropTypes from 'prop-types';
import { BookingElementStyle } from '../styles/BookingElementStyle';
import styled from 'styled-components';

// set the color of the status text
const StatusColor = styled.span`
  color: ${props => props.color};
`

const BookingElement = (props) => {
  // set the color of the status text
  let color = '';
  if (props.bookingInfo.status === 'pending') {
    color = '#dcd504';
  } else if (props.bookingInfo.status === 'accepted') {
    color = '#03821e';
  } else {
    color = '#a50303';
  }
  return (
  <>
      <BookingElementStyle>
        <h6 name='BookingStatusInfo'>Id: {props.bookingInfo.id}&nbsp;
        Price: ${props.bookingInfo.totalPrice}&nbsp;
        From: {props.bookingInfo.dateRange.startdd}/{props.bookingInfo.dateRange.startmm}/{props.bookingInfo.dateRange.startyy}&nbsp;
        To: {props.bookingInfo.dateRange.enddd}/{props.bookingInfo.dateRange.endmm}/{props.bookingInfo.dateRange.endyy}&nbsp;
        status: <StatusColor color={color}>{props.bookingInfo.status}</StatusColor>
        </h6>
      </BookingElementStyle>
  </>
  );
}

export default BookingElement;

// used for linting purpose
BookingElement.propTypes = {
  bookingInfo: PropTypes.object
}
