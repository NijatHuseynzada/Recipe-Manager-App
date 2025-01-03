import React, { useState, useEffect } from 'react';
import { createRecipe, fetchRecipeById, updateRecipe } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    tags: '',
    difficulty: 'Easy',
  });

  useEffect(() => {
    if (id) {
      fetchRecipeById(id)
        .then((response) => {
          const recipe = response.data;
          setForm({
            ...recipe,
            ingredients: recipe.ingredients.join(','),
            steps: recipe.steps.join(','),
            tags: recipe.tags.join(','),
          });
        })
        .catch((error) => console.error('Error fetching recipe:', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      ...form,
      ingredients: form.ingredients.split(',').map((item) => item.trim()),
      steps: form.steps.split(',').map((item) => item.trim()),
      tags: form.tags.split(',').map((item) => item.trim()),
    };

    try {
      if (id) {
        await updateRecipe(id, recipeData);
        alert('Recipe updated successfully!');
      } else {
        await createRecipe(recipeData);
        alert('Recipe added successfully!');
      }
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save the recipe. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">{id ? 'Edit Recipe' : 'Add a New Recipe'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter recipe title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter recipe description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <input
            type="text"
            id="ingredients"
            placeholder="Comma-separated ingredients (e.g., sugar, milk)"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="steps">Steps</label>
          <input
            type="text"
            id="steps"
            placeholder="Comma-separated steps (e.g., mix, bake, serve)"
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            placeholder="Comma-separated tags (e.g., dessert, quick)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
  <label htmlFor="image">Image URL</label>
  <input
    type="text"
    id="image"
    placeholder="Enter image URL (e.g., /images/recipe.jpg)"
    value={form.image || ''}
    onChange={(e) => setForm({ ...form, image: e.target.value })}
  />
</div>

        <button type="submit" className="btn-submit">Save Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
