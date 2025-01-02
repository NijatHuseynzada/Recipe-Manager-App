import React, { useState, useEffect } from 'react';
import { fetchRecipes, deleteRecipe } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await fetchRecipes();
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes. Please try again.');
      }
    };

    loadRecipes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmDelete) return;

    try {
      await deleteRecipe(id);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete the recipe. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate(/edit-recipe/${id});
  };

  const toggleExpanded = (id) => {
    setExpandedRecipe(expandedRecipe === id ? null : id); // Toggle the expanded card
  };

  return (
    <div className="container">
      <h1>Recipes</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
              onClick={() => toggleExpanded(recipe.id)}
            />
            <div className="recipe-content">
              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-description">{recipe.description}</p>
            </div>

            {expandedRecipe === recipe.id && (
              <div className="recipe-details">
                <h4>Ingredients</h4>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h4>Steps</h4>
                <ol>
                  {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                <div className="recipe-actions">
                  <button onClick={() => handleEdit(recipe.id)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(recipe.id)} className="btn-delete">
                  🗑
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
