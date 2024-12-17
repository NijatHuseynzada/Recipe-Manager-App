import React, { useState } from 'react';

const RecipeCard = ({ recipe, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        margin: '10px',
        position: 'relative',
        borderRadius: '5px',
        background: '#f9f9f9',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{recipe.title}</h3>
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
      <p><strong>Steps:</strong> {recipe.steps.join(', ')}</p>
      <p><strong>Tags:</strong> {recipe.tags.join(', ')}</p>
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
      <p><strong>Last Updated:</strong> {recipe.updatedAt}</p>

      {isHovered && (
        <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
          <button onClick={() => onEdit(recipe)} style={{ marginRight: '5px' }}>
            Edit
          </button>
          <button onClick={() => onDelete(recipe.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
