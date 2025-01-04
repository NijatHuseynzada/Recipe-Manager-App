import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import RecipeList from './RecipeList.jsx';
import RecipeForm from './RecipeForm.jsx';
import ContactPage from './ContactPage.jsx';

const App = () => {
  return (
    <Router>
      <header className="navbar">
        <div className="navbar-brand">Recipe Manager</div>
        <nav className="navbar-links">
        <NavLink
  to="/"
  className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
>
  Home
</NavLink>
<NavLink
  to="/recipes"
  className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
>
  Recipes
</NavLink>
<NavLink
  to="/add-recipe"
  className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
>
  Add Recipe
</NavLink>
<NavLink
  to="/contact"
  className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
>
  Contact
</NavLink>

        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/add-recipe" element={<RecipeForm />} />
        <Route path="/edit-recipe/:id" element={<RecipeForm />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
};

export default App;
