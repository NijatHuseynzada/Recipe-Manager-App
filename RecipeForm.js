import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = ({ refresh, editingRecipe, setEditingRecipe }) => {
  const [formData, setFormData] = useState(
    editingRecipe || {
      title: '',
      description: '',
      ingredients: '',
      steps: '',
      tags: '',
      difficulty: 'Easy',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      ingredients: formData.ingredients.split(','),
      steps: formData.steps.split(','),
      tags: formData.tags.split(','),
      updatedAt: new Date().toISOString(),
    };

    if (editingRecipe) {
      // Update an existing recipe
      await axios.put(`http://localhost:3001/recipes/${editingRecipe.id}`, data);
      setEditingRecipe(null);
    } else {
      // Create a new recipe
      await axios.post('http://localhost:3001/recipes', data);
    }

    setFormData({
      title: '',
      description: '',
      ingredients: '',
      steps: '',
      tags: '',
      difficulty: 'Easy',
    });
    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingRecipe ? 'Edit Recipe' : 'Create Recipe'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ingredients"
        placeholder="Ingredients (comma-separated)"
        value={formData.ingredients}
        onChange={handleChange}
      />
      <input
        type="text"
        name="steps"
        placeholder="Steps (comma-separated)"
        value={formData.steps}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={formData.tags}
        onChange={handleChange}
      />
      <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button type="submit">{editingRecipe ? 'Update' : 'Add'} Recipe</button>
      {editingRecipe && (
        <button type="button" onClick={() => setEditingRecipe(null)}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default RecipeForm;
