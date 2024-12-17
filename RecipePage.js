import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const fetchRecipes = async () => {
    const response = await axios.get('http://localhost:3001/recipes');
    setRecipes(response.data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/recipes/${id}`);
    fetchRecipes();
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  return (
    <div>
      <h1>Manage Recipes</h1>
      <RecipeForm
        refresh={fetchRecipes}
        editingRecipe={editingRecipe}
        setEditingRecipe={setEditingRecipe}
      />
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default RecipePage;
