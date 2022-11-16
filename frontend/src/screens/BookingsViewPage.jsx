// This page is the page to view booking request and history of a certain hosted listing
import React from 'react';
import Button from '@mui/material/Button';
import { makeRequest, navTo } from '../helpers';
import PropTypes from 'prop-types';
import BookingRequest from '../components/BookingRequest';
import BookingElement from '../components/BookingElement';

const BookingViewPage = (props) => {
  const path = props.path.replace('/hostedListing/Listbookingview/', '')
  const [pendingBookingList, setPendingBookingList] = React.useState([]);
  const [doneBookingList, setDoneBookingList] = React.useState([]);
  const [days, setDays] = React.useState(0);
  const [profit, setProfit] = React.useState(0);
  const [isDoneListingOp, setDoneListingOp] = React.useState(null);

  // get the post time diff
  const postTime = new Date(props.hostlistingInfo.postedOn);
  const now = new Date();
  const diff = now.getTime() - postTime.getTime();

  const hourDiff = (diff / (1000 * 60 * 60)).toFixed(0);

  // get the bookings details
  React.useEffect(async () => {
    const newList = [];
    const doneNewList = [];
    const bookingInfo = await makeRequest('/bookings', 'GET', undefined, props.token);
    if (bookingInfo) {
      console.log(bookingInfo);
      let totalDays = 0;
      let totalProfit = 0
      // find all the pending bookings related to the listing
      for (let i = 0; i < bookingInfo.bookings.length; i++) {
        // check if listing id are same
        if (bookingInfo.bookings[i].listingId === path) {
          if (bookingInfo.bookings[i].status === 'pending') {
            newList.push(<BookingRequest bookingInfo={bookingInfo.bookings[i]} token={props.token} setDoneListingOp={setDoneListingOp}/>);
          } else {
            // check the date
            doneNewList.push(<BookingElement bookingInfo={bookingInfo.bookings[i]}/>)
            if (bookingInfo.bookings[i].status === 'accepted') {
              const DateRange = bookingInfo.bookings[i].dateRange;
              // calculate the days and profits
              const startDate = new Date(DateRange.startdd + '/' + DateRange.startmm + '/' + DateRange.startyy);
              const endDate = new Date(DateRange.enddd + '/' + DateRange.endmm + '/' + DateRange.endyy);
              // get the diff in days
              const diff = endDate.getTime() - startDate.getTime();
              const daydiff = diff / (1000 * 60 * 60);
              totalDays += daydiff;
              // get the profit
              totalProfit += bookingInfo.bookings[i].totalPrice;
            }
          }
        }
      }
      setDays(totalDays);
      setProfit(totalProfit);
      setPendingBookingList(newList);
      setDoneBookingList(doneNewList);
    }
  }, [isDoneListingOp]);
  return (
    <>
      <div><Button style={{ 'margin-left': 10 + 'px', 'margin-top': 10 + 'px' }} size='medium' variant="contained" onClick= { () => { navTo(props.nav, '/hostedListing') } } >Back</Button></div>
      <br />

      {/* Booking request section */}
      <hr />
      <h3>&nbsp;Booking Requests</h3>
      <hr />
      {pendingBookingList.length === 0 &&
      <h5>&nbsp;No Booking Requests</h5>
      }
      {pendingBookingList}
      <br />

      {/* History details section */}
      <hr />
      <h3>&nbsp;History details</h3>
      <hr />
      <h6>&nbsp;This listing was posted {hourDiff} hours ago</h6>
      <h6>&nbsp;The listing has been booked {days} days this year</h6>
      <h6>&nbsp;Profit made this year: ${profit}</h6>
      <h5 style={{ textAlign: 'center' }}>Booking request history</h5>
      <div>{doneBookingList}</div>
      <br />
    </>
  );
}

export default BookingViewPage;

// use for linting purpose
BookingViewPage.propTypes = {
  nav: PropTypes.func,
  hostlistingInfo: PropTypes.object,
  token: PropTypes.string,
  path: PropTypes.string
}
