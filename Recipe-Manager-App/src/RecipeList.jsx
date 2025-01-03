import React, { useState, useEffect } from 'react';
import { fetchRecipes, deleteRecipe } from '../api';
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('');
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
    navigate(`/edit-recipe/${id}`);
  };

  const handleSearch = (recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
    );
  };

  const handleFilter = (recipe) => {
    const tagMatch = selectedTag ? recipe.tags.includes(selectedTag) : true;
    const difficultyMatch = selectedDifficulty ? recipe.difficulty === selectedDifficulty : true;
    return tagMatch && difficultyMatch;
  };

  const handleSort = (a, b) => {
    switch (sortOption) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'updateTime':
        return new Date(b.last_updated) - new Date(a.last_updated);
      case 'difficulty':
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  };

  const filteredAndSortedRecipes = recipes
    .filter(handleSearch)
    .filter(handleFilter)
    .sort(handleSort);

  const toggleExpanded = (id) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  return (
    <div className="container">
      <h1>Recipes</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search recipes by title, description, or ingredients"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Filter Options */}
      <div className="filter-options">
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
          <option value="">Filter by Tag</option>
          {Array.from(new Set(recipes.flatMap((recipe) => recipe.tags))).map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          value={selectedDifficulty}
        >
          <option value="">Filter by Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Sort Options */}
      <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
        <option value="">Sort by</option>
        <option value="title">Title</option>
        <option value="updateTime">Last Updated</option>
        <option value="difficulty">Difficulty</option>
      </select>

      <div className="recipe-grid">
        {filteredAndSortedRecipes.map((recipe) => (
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

              {/* Add Difficulty and Tags */}
              <div className="recipe-meta">
                <p className="recipe-difficulty">Difficulty: {recipe.difficulty}</p>
                <div className="recipe-tags">
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="recipe-updated">Last updated: {new Date(recipe.last_updated).toLocaleString()}</p>
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
