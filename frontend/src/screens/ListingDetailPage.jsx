import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { navTo, makeRequest } from '../helpers';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import BookingElement from '../components/BookingElement';
import { BookingListStyle } from '../styles/BookingElementStyle';
import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import { ListingInputStyle } from '../styles/ListingFormStyle';
import CommentElement from '../components/CommentElement';
import { ReviewListStyle } from '../styles/reviewElementStyle';

// This is the listing page that users can view after click more Info on the dashboard listings
const ListingPage = (props) => {
  const info = props.info;
  console.log(info);
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

  // construct the booking list
  const newList = [];
  let hasRightToReview = false;
  let reviewBookingId = 0;
  if (info.bookings) {
    for (let i = 0; i < info.bookings.bookings.length; i++) {
      const bookingInfo = info.bookings.bookings[i];
      // check if the listing and owner of the booking, if all same, add the booking element into listing detail page
      if (bookingInfo.owner === props.email && parseInt(bookingInfo.listingId) === info.id) {
        if (bookingInfo.status === 'accepted') {
          hasRightToReview = true;
          reviewBookingId = bookingInfo.id;
        }
        newList.push(<BookingElement bookingInfo={bookingInfo} />);
      }
    }
  }
  const [bookingList, setBookingList] = React.useState(newList);

  // date state variables to make bookings
  const [startdd, setStartdd] = React.useState(null);
  const [startmm, setStartmm] = React.useState(null);
  const [startyy, setStartyy] = React.useState(null);
  const [enddd, setEnddd] = React.useState(null);
  const [endmm, setEndmm] = React.useState(null);
  const [endyy, setEndyy] = React.useState(null);

  const [isBookSucceed, setBookSucceed] = React.useState(false);
  // the rating value that will trace the rating that user made in leave reviews section
  let [ratingVal, setRatingVal] = React.useState(0);
  const [comment, setComment] = React.useState('');

  // get the original average rating and comments
  let ratingTotal = 0;
  // the list that will store all the comment
  const commentListArray = [];
  for (let i = 0; i < info.reviews.length; i++) {
    ratingTotal += info.reviews[i].rating;
    commentListArray.push(<CommentElement rating={info.reviews[i].rating} comment={info.reviews[i].comment}/>)
  }

  // init the original comment list of the listing
  const [commentList, setCommentList] = React.useState(commentListArray);
  const [TotalRating, setTotalRating] = React.useState(ratingTotal);
  const [ratingNumber, setRatingNumber] = React.useState(info.reviews.length)

  let averageRating = 0;
  if (ratingNumber !== 0) {
    averageRating = parseInt(TotalRating) / parseInt(ratingNumber);
  }

  // handler of click submit review
  const reviewSubmit = async () => {
    // check the comment content
    if (comment === '') {
      alert('Comment can not be empty string.')
      return;
    }
    if (ratingVal === null) {
      ratingVal = 0;
    }

    // make the request to the server
    const data = await makeRequest('/listings/' + info.id + '/review/' + reviewBookingId, 'PUT',
      {
        review:
          {
            rating: ratingVal,
            comment
          }
      }, props.token);
    if (data) {
      // reset the rating
      setTotalRating(TotalRating + ratingVal);
      setRatingNumber(ratingNumber + 1);
      // add comment immediately after submit review
      setCommentList(commentList.concat(<CommentElement rating={ratingVal} comment={comment}/>));
      setRatingVal(0);
      setComment('');
    }
  }

  // handle the book request when 'book' button is clicked
  const bookhandler = async () => {
    // get the dateRange and totalPrice value
    const dateRange = { startdd, startmm, startyy, enddd, endmm, endyy };
    const expstartDateVal = parseInt(startdd) + 30 * parseInt(startmm) + 365 * parseInt(startyy);
    const expEndDateVal = parseInt(enddd) + 30 * parseInt(endmm) + 365 * parseInt(endyy);
    const numdays = expEndDateVal - expstartDateVal;
    const totalPrice = numdays * parseInt(info.price);

    // check if dateRange is available
    const ava = info.availability;
    let inRange = false;
    for (let i = 0; i < ava.length; i += 2) {
      const startDateVal = parseInt(ava[i].day) + 30 * parseInt(ava[i].month) + 365 * parseInt(ava[i].year);
      const EndDateVal = parseInt(ava[i + 1].day) + 30 * parseInt(ava[i + 1].month) + 365 * parseInt(ava[i + 1].year);
      // compare the date value
      if (startDateVal <= expstartDateVal && EndDateVal >= expEndDateVal) {
        inRange = true;
        break;
      }
    }
    if (inRange === false) {
      alert('date range not available for this listing');
      return;
    }

    // make the booking create request to server
    const data = await makeRequest('/bookings/new/' + info.id, 'POST', { dateRange, totalPrice }, props.token);
    if (data) {
      const newInfo = { id: data.bookingId, totalPrice, status: 'pending', dateRange }
      // add booking info to list
      setBookingList(bookingList.concat(<BookingElement bookingInfo={newInfo} />))
      // add a temporary 3 seconds message feedback to indicate the making has done successfully.
      setBookSucceed(true);
      setTimeout(() => { setBookSucceed(false) }, 2000);
    }
  }

  return (
    <>
      <div>
      <Button
      style={{
        marginLeft: 10 + 'px',
        marginTop: 10 + 'px'
      }}
      size='large'
      variant="contained"
      onClick= { () => { navTo(props.nav, '/') } } >
      Back
      </Button>
      </div>

      {/* listing detail showcase section */}
      <h2 style={{ textAlign: 'center' }}>Listing details</h2>
      <div style={{
        margin: 10 + 'px',
        background: 'white',
        padding: 10 + 'px',
        borderRadius: 10 + 'px'
      }}>
      <h1 style={{ textAlign: 'center' }}>{info.title}</h1>
      <h5>Address: {addressString}</h5>
      <h5>Type: {info.metadata.type}</h5>
      <h5>Rooms: {info.metadata.bathrooms} bathroom(s), {bedrooms} bedroom(s) and {beds} bed(s)</h5>
      <h5>Amenities: {info.metadata.amenities}</h5>
      {/* if user did not use date range filter, return price per night, else return price per stay */}
      {!info.isUseDate &&
        <h5>Price per night: ${info.price}</h5>
      }
      {info.isUseDate &&
        <h5>Price per stay: ${pricePerStay}</h5>
      }
      <h5>Review rating: <Rating name="half-rating-read" value={averageRating} precision={0.1} readOnly /></h5>

      {/* listing pictures(including thumbnail) section */}
      </div>
      <h2 style={{ textAlign: 'center' }}>House pictures</h2>
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

      {/* make bookings section */}
      <h2 style={{ textAlign: 'center' }}>Make bookings</h2>
      {!props.token &&
      <h5 style={{ textAlign: 'center' }}>Please login/sign up to make bookings</h5>
      }
      {props.token &&
        <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: 80 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        noValidate
        autoComplete="off"
        >
        <div>
        <h6>Start:</h6>
        <TextField
        name="bookingStartDD"
        id="outlined-basic"
        type='number'
        label="DD"
        variant="outlined"
        size='small'
        value={startdd}
        onChange={(event) => setStartdd(event.target.value)}
        />
        <TextField
        name="bookingStartMM"
        id="outlined-basic"
        type='number'
        label="MM"
        variant="outlined"
        size='small'
        value={startmm}
        onChange={(event) => setStartmm(event.target.value)}
        />
        <TextField
        name="bookingStartYY"
        id="outlined-basic"
        type='number'
        label="YYYY"
        variant="outlined"
        size='small'
        value={startyy}
        onChange={(event) => setStartyy(event.target.value)}
        />
        </div>

        <div>
        <h6>End:</h6>
        <TextField
        name="bookingEndDD"
        id="outlined-basic"
        type='number'
        label="DD"
        variant="outlined"
        size='small'
        value={enddd}
        onChange={(event) => setEnddd(event.target.value)}
        />
        <TextField
        name="bookingEndMM"
        id="outlined-basic"
        type='number'
        label="MM"
        variant="outlined"
        size='small'
        value={endmm}
        onChange={(event) => setEndmm(event.target.value)}
        />
        <TextField
        name="bookingEndYY"
        id="outlined-basic"
        type='number'
        label="YYYY"
        variant="outlined"
        size='small'
        value={endyy}
        onChange={(event) => setEndyy(event.target.value)}
        />
        </div>
        <Button name="bookingConfirmButton" size='medium' variant="contained" onClick={bookhandler}>Confirm</Button>
        {isBookSucceed &&
        <>
        <br />
        <Alert severity="success">Booking successfully made!</Alert>
        </>
        }
      </Box>
      }
      <br />

      {/* booking status section */}
      <h2 style={{ textAlign: 'center' }}>Your Booking status</h2>

      {!props.token &&
      <h5 style={{ textAlign: 'center' }}>Please login/sign up to view your booking status.</h5>
      }

      {props.token &&
      <BookingListStyle>{bookingList}</BookingListStyle>
      }
    <br />

    {/* leave reviews section */}
    <h2 style={{ textAlign: 'center' }}>Leave a Review</h2>
    {!props.token &&
      <h5 style={{ textAlign: 'center' }}>Please login/sign up to leave review</h5>
    }

    {!hasRightToReview &&
      <h5 style={{ textAlign: 'center' }}>You can not review until your booking is accepted.</h5>
    }

    {hasRightToReview &&
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h6 style={{ textAlign: 'center' }}>
      <Rating
          name="simple-controlled"
          value={ratingVal}
          onChange={(event, newValue) => {
            setRatingVal(newValue);
          }}
      /></h6>
      <h6 style={{ textAlign: 'center' }}>Comment</h6>
      <ListingInputStyle>
        <textarea
        style={{ width: 30 + 'vw', height: 30 + 'vh' }}
        placeholder='Describe how was the experience.'
        onChange={(event) => setComment(event.target.value)}
        value={comment}>
        </textarea>
      </ListingInputStyle>
      <Button
      style={{
        marginLeft: 10 + 'px',
        marginTop: 10 + 'px'
      }}
      size='medium'
      variant="contained"
      onClick= {reviewSubmit} >
        Submit Review
      </Button>
    </div>
    }
    <br />
    <h2 style={{ textAlign: 'center' }}>Listing Reviews</h2>
    <ReviewListStyle>
      {commentList}
    </ReviewListStyle>
    <br />
    <br />
    </>
  );
}

export default ListingPage;

// use for linting purpose
ListingPage.propTypes = {
  path: PropTypes.string,
  token: PropTypes.string,
  nav: PropTypes.func,
  info: PropTypes.object,
  email: PropTypes.string
}
