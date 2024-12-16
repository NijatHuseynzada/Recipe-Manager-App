import React from 'react';
import FeaturedRecipe from '../components/FeaturedRecipe';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the Recipe Manager App</h1>
      <p>This app allows you to create, view, edit, and organize your favorite recipes.</p>

      <FeaturedRecipe />

      <div className="projects">
        <h2>My Web and Mobile 1 Course Projects</h2>
        <ul>
          <li>
            <a href="https://github.com/yourusername/project1" target="_blank" rel="noopener noreferrer">
              Project 1: Recipe Manager App (GitHub Repository)
            </a>
          </li>
          <li>
            <a href="https://yourproject1.github.io" target="_blank" rel="noopener noreferrer">
              Project 2: Web Portfolio (GitHub Pages)
            </a>
          </li>
          <li>
            <a href="https://youtube.com/your-video" target="_blank" rel="noopener noreferrer">
              Project 3: Mobile App Demo (YouTube)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
