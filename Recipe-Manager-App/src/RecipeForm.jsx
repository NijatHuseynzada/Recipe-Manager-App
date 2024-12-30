import React, { useState } from 'react';
import { createRecipe } from '../services/api';

const RecipeForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    tags: '',
    difficulty: 'Easy',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      ...form,
      ingredients: form.ingredients.split(','),
      steps: form.steps.split(','),
      tags: form.tags.split(','),
    };

    createRecipe(newRecipe)
      .then(() => alert('Recipe added successfully!'))
      .catch((error) => console.error('Error adding recipe:', error));
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add a New Recipe</h1>
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

        <button type="submit" className="btn-submit">Save Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
