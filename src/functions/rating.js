import React from 'react';
import StarRatings from 'react-star-ratings';

const showAverage = (product) => {
  if (product && product.ratings) {
    let ratingsArray = product.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((rating) => total.push(rating.star));
    let totalReduced = total.reduce((total, star) => total + star, 0);

    let result = totalReduced / length;
    return (
      <div className='text-center pt-1 pb-3'>
        <StarRatings
          starDimension='20px'
          starSpacing='2px'
          starRatedColor='red'
          editing={false}
          rating={result}
        />{' '}
        ({product.ratings.length})
      </div>
    );
  }
};

export default showAverage;
