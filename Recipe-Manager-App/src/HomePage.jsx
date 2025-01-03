import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../api';

const HomePage = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  useEffect(() => {
    const loadFeaturedRecipe = async () => {
      try {
        const response = await fetchRecipes();
        if (response.data.length > 0) {
          setFeaturedRecipe(response.data[response.data.length - 1]); // Show the newest recipe
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
        <h1>Welcome to the Recipe Manager App</h1>
        <p>Discover, save, and manage your favorite recipes effortlessly.</p>
      </header>

      {featuredRecipe ? (
        <section className="featured-section">
          <h2>Featured Recipe</h2>
          <div className="featured-card">
            <img
              src={featuredRecipe.image}
              alt={featuredRecipe.title}
              className="featured-image"
            />
            <div className="featured-content">
              <h3>{featuredRecipe.title}</h3>
              <p>{featuredRecipe.description}</p>
            </div>
          </div>
        </section>
      ) : (
        <p className="no-featured">No featured recipe available. Add a recipe to get started!</p>
      )}

      <section className="projects-section">
        <h2>My Projects</h2>
        <ul className="project-list">
          <li><a href="https://github.com/your-username/project1" target="_blank" rel="noopener noreferrer">Project 1</a></li>
          <li><a href="https://github.com/your-username/project2" target="_blank" rel="noopener noreferrer">Project 2</a></li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
