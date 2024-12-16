import React from 'react';

const FeaturedRecipe = () => {
  return (
    <div className="featured-recipe">
      <h2>Featured Recipe</h2>
      <div className="recipe-card">
        <h3>Spaghetti Bolognese</h3>
        <p>A classic Italian pasta dish with a rich meat sauce.</p>
        <ul>
          <li>Spaghetti</li>
          <li>Ground Beef</li>
          <li>Tomato Sauce</li>
          <li>Onion</li>
          <li>Garlic</li>
        </ul>
        <p>Preparation: Cook spaghetti. Prepare sauce with meat, tomatoes, and garlic. Combine.</p>
      </div>
    </div>
  );
};

export default FeaturedRecipe;
