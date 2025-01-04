import React, { useState, useEffect } from 'react';
import { fetchRecipesPaginated, deleteRecipe } from '../api';
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterActive, setFilterActive] = useState(false); // NEW: Track active filters
  const [selectedRecipes, setSelectedRecipes] = useState([]); // NEW: Track selected recipes

  const navigate = useNavigate();

  // Fetch recipes based on pagination or filter state
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);

        // Fetch filtered recipes when filters/search are active
        if (filterActive) {
          const filteredData = applyFiltersAndSort(allRecipes);
          setRecipes(filteredData);
          setLoading(false);
          return;
        }

        // Fetch paginated recipes when no filters/search are applied
        const response = await fetchRecipesPaginated(page, 25);
        const uniqueRecipes = response.filter(
          (newRecipe) => !allRecipes.some((recipe) => recipe.id === newRecipe.id)
        );

        setAllRecipes((prev) => [...prev, ...uniqueRecipes]);
        if (page === 1) setRecipes(uniqueRecipes);
        else setRecipes((prev) => [...prev, ...uniqueRecipes]);

        if (uniqueRecipes.length < 25) setHasMore(false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes. Please try again.');
        setLoading(false);
      }
    };

    loadRecipes();
  }, [page, filterActive]); // Trigger fetch when page changes or filters are applied

  // Apply filters and sorting whenever filters or sorting options change
  useEffect(() => {
    if (searchQuery || selectedTag || selectedDifficulty || sortOption) {
      setFilterActive(true); // Filters are active
      setRecipes(applyFiltersAndSort(allRecipes));
    } else {
      setFilterActive(false); // Reset filters
      setPage(1); // Reset pagination
      setRecipes(allRecipes.slice(0, 10)); // Reset to the first page of recipes
    }
  }, [searchQuery, selectedTag, selectedDifficulty, sortOption]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmDelete) return;

    try {
      await deleteRecipe(id);
      setAllRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete the recipe. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-recipe/${id}`);
  };

  const applyFiltersAndSort = (data) => {
    let filteredRecipes = data;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.tags?.includes(selectedTag));
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.difficulty === selectedDifficulty);
    }

    // Apply sorting
    if (sortOption) {
      filteredRecipes.sort((a, b) => {
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
      });
    }

    // Remove duplicates by ensuring each recipe has a unique ID
    const uniqueRecipes = Array.from(new Set(filteredRecipes.map((recipe) => recipe.id))).map((id) =>
      filteredRecipes.find((recipe) => recipe.id === id)
    );

    return uniqueRecipes;
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleTagChange = (e) => setSelectedTag(e.target.value);
  const handleDifficultyChange = (e) => setSelectedDifficulty(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const toggleExpanded = (id) => setExpandedRecipe(expandedRecipe === id ? null : id);

  const loadMoreRecipes = () => {
    if (!loading && hasMore && !filterActive) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRecipes();
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.querySelector('#sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const handleSelectRecipe = (id) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((recipeId) => recipeId !== id) : [...prev, id]
    );
  };

  const handleSendEmail = () => {
    const selectedRecipeDetails = recipes.filter((recipe) =>
      selectedRecipes.includes(recipe.id)
    );

    const emailBody = encodeURIComponent(
      JSON.stringify(selectedRecipeDetails, null, 2)
    );

    const mailtoLink = `mailto:?subject=Selected Recipes&body=${emailBody}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="container">
      <h1>Recipes</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search recipes by title, description, or ingredients"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Filter Options */}
      <div className="filter-options">
        <select onChange={handleTagChange} value={selectedTag}>
          <option value="">Filter by Tag</option>
          {Array.from(new Set(allRecipes.flatMap((recipe) => recipe.tags || []))).map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select onChange={handleDifficultyChange} value={selectedDifficulty}>
          <option value="">Filter by Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Sort Options */}
      <select onChange={handleSortChange} value={sortOption}>
        <option value="">Sort by</option>
        <option value="title">Title</option>
        <option value="updateTime">Last Updated</option>
        <option value="difficulty">Difficulty</option>
      </select>

      <button onClick={handleSendEmail} className="btn-submit">
        Send Selected Recipes via Email
      </button>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <input
              type="checkbox"
              checked={selectedRecipes.includes(recipe.id)}
              onChange={() => handleSelectRecipe(recipe.id)}
            />
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
              onClick={() => toggleExpanded(recipe.id)}
            />
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>

              <div className="recipe-meta">
                <p className="recipe-difficulty">Difficulty: {recipe.difficulty}</p>
                <div className="recipe-tags">
                  {recipe.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="recipe-updated">
                Last updated: {new Date(recipe.last_updated).toLocaleString()}
              </p>
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
        {loading && <p>Loading more recipes...</p>}
        <div id="sentinel" style={{ height: '1px' }}></div>
      </div>
    </div>
  );
};

export default RecipeList;
