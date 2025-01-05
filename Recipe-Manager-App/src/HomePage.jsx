import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../api';

const HomePage = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  useEffect(() => {
    const loadFeaturedRecipe = async () => {
      try {
        const response = await fetchRecipes();
        if (response.data.length > 0) {
          setFeaturedRecipe(response.data[response.data.length - 1]); // Shows the newest recipe
        }
      } catch (error) {
        console.error('Error fetching featured recipe:', error);
        alert('Failed to load the featured recipe.');
      }
    };

    loadFeaturedRecipe();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to our place!</h1>
        <p>Discover, save, and manage your favorite recipes effortlessly.</p>
      </header>

      {featuredRecipe ? (
        <section className="featured-section">
          <h2>Today's Menu:</h2>
          <div className="featured-card">
            <img
              src={featuredRecipe.image}
              alt={featuredRecipe.title}
              className="featured-image"
            />
            <div className="featured-content">
              <h3>{featuredRecipe.title}</h3>
              <p>{featuredRecipe.description}</p>
              <h4>Ingredients:</h4>
              <ul>
                {featuredRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h4>Steps:</h4>
              <ol>
                {featuredRecipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : (
        <p className="no-featured">No featured recipe available. Add a recipe to get started!</p>
      )}

<section className="projects-section">
  <h4>Our Projects</h4>
  <ul className="project-list">
    <li>
      <a
        href="https://github.com/ayxanismayilov17950/form_filler_project_1.git"
        target="_blank"
        rel="noopener noreferrer"
      >
        Auto Form Filler Extension
      </a>
      <p className="project-description">
        A browser extension to auto-fill web forms with LinkedIn data, making the form-filling process faster and more efficient.
      </p>
    </li>
    <li>
      <a
        href="https://github.com/NijatHuseynzada/Recipe-Manager-App.git"
        target="_blank"
        rel="noopener noreferrer"
      >
        Recipe Manager
      </a>
      <p className="project-description">
        A recipe management application where users can add, update, delete, and organize their favorite recipes.
      </p>
    </li>
  </ul>
</section>

      <section className="error-report-section">
  <h3 className="error-report-title">
    Our app is still in development. If you encounter any issues, <br></br> please let us know by filling out the 
    <a href="/contact" className="contact-link"> Contact Form</a>.
  </h3>
</section>

    </div>
  );
};

export default HomePage;
