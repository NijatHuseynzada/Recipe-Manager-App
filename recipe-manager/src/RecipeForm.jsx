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
    <div className="container">
      <h1>Add a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ingredients (comma-separated)"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
        />
        <input
          type="text"
          placeholder="Steps (comma-separated)"
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
