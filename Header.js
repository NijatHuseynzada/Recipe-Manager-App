import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="p-4 bg-gray-800 text-white">
      <nav className="flex justify-between">
        <h1 className="text-xl">Recipe Manager</h1>
        <ul className="flex gap-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
