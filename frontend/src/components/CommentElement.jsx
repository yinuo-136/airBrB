import React from 'react';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import { ReviewElementStyle } from '../styles/reviewElementStyle';

const CommentElement = (props) => {
  return (
    <ReviewElementStyle>
    <div>
      <Rating name="half-rating-read" value={props.rating} precision={1} readOnly />
    </div>
    <div>&nbsp;{props.comment}</div>
    </ReviewElementStyle>
  );
}

export default CommentElement;

CommentElement.propTypes = {
  rating: PropTypes.number,
  comment: PropTypes.string
}
