import React, { Fragment } from 'react';
import StarRatings from 'react-star-ratings';

const Star = ({ starClick, numberOfStars }) => (
  <Fragment>
    <StarRatings
      changeRating={() => starClick(numberOfStars)}
      numberOfStars={numberOfStars}
      starDimension='20px'
      starSpacing='2px'
      starHoverColor='red'
      starEmptyColor='red'
    />
    <br />
  </Fragment>
);

export default Star;
