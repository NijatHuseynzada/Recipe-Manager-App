import React, { useState, useEffect } from 'react';
import { fetchRecipesPaginated, deleteRecipe, updateRecipesOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { throttle } from 'lodash';



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
  const [filterActive, setFilterActive] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);

        const response = await fetchRecipesPaginated(page, 100);
        const recipeMap = new Map();

        // Merge current and new recipes, ensuring unique IDs
        [...allRecipes, ...response].forEach((recipe) => {
          recipeMap.set(recipe.id, recipe);
        });

        const deduplicatedRecipes = Array.from(recipeMap.values());

        if (page === 1) {
          setAllRecipes(deduplicatedRecipes);
          setRecipes(deduplicatedRecipes);
        } else {
          setAllRecipes(deduplicatedRecipes);
          setRecipes((prev) => [...prev, ...deduplicatedRecipes.slice(prev.length)]);
        }

        if (response.length < 20) setHasMore(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (page === 1) {
      // Reset state for new fetch
      setAllRecipes([]);
      setRecipes([]);
    }

    loadRecipes();
  }, [page]);

  useEffect(() => {
    if (searchQuery || selectedTag || selectedDifficulty || sortOption) {
      setFilterActive(true);
      setRecipes(applyFiltersAndSort(allRecipes));
    } else {
      setFilterActive(false);
      setRecipes(allRecipes); // Reset to all recipes when no filters are applied
    }
  }, [searchQuery, selectedTag, selectedDifficulty, sortOption]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmDelete) return;

    try {
      await deleteRecipe(id);

      setAllRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
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

  const applyFiltersAndSort = (data) => {
    let filteredRecipes = data;
  
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(query)
          ) ||
          (recipe.tags && recipe.tags.some((tag) => tag.toLowerCase().includes(query))) // Search tags
      );
    }
  
    if (selectedTag) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.tags?.includes(selectedTag)
      );
    }
  
    if (selectedDifficulty) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.difficulty === selectedDifficulty
      );
    }
  
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
  
    const uniqueRecipes = Array.from(new Set(filteredRecipes.map((recipe) => recipe.id))).map((id) =>
      filteredRecipes.find((recipe) => recipe.id === id)
    );
  
    return uniqueRecipes;
  };  

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    // Rearrange local recipes array
    const reorderedRecipes = Array.from(recipes);
    const [movedItem] = reorderedRecipes.splice(result.source.index, 1);
    reorderedRecipes.splice(result.destination.index, 0, movedItem);
  
    // Update the order field in each recipe
    const updatedRecipes = reorderedRecipes.map((recipe, index) => ({
      ...recipe,
      order: index,
    }));
  
    setRecipes(updatedRecipes);
  
    // Persist updated order to the backend
    try {
      await updateRecipesOrder(updatedRecipes);
      console.log('Order updated on the server.');
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order. Please try again.');
    }
  };
  
  
  useEffect(() => {
    const handleScroll = throttle(() => {
        console.log(
            'Scroll Position:',
            window.innerHeight + document.documentElement.scrollTop,
            'Offset Height:',
            document.documentElement.offsetHeight
        );

        if (
            window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight &&
            hasMore &&
            !loading
        ) {
            console.log('Loading more recipes...');
            setPage((prevPage) => prevPage + 1);
        }
    }, 200);

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        handleScroll.cancel();
    };
}, [hasMore, loading]);


const resetAndApplyFilters = () => {
  setPage(1); // Reset to the first page
  setHasMore(true); // Allow loading of subsequent pages
  setRecipes(applyFiltersAndSort(allRecipes));
};

useEffect(() => {
  if (searchQuery || selectedTag || selectedDifficulty || sortOption) {
      resetAndApplyFilters();
  }
}, [searchQuery, selectedTag, selectedDifficulty, sortOption]);


const mergeRecipes = (newRecipes) => {
  const recipeMap = new Map();
  [...allRecipes, ...newRecipes].forEach((recipe) => recipeMap.set(recipe.id, recipe));
  return Array.from(recipeMap.values());
};

useEffect(() => {
  if (page > 1) {
      const fetchMoreRecipes = async () => {
          try {
              setLoading(true);
              console.log('Fetching page:', page);
              const newRecipes = await fetchRecipesPaginated(page, 20, sortOption);
              setAllRecipes((prevRecipes) => mergeRecipes(newRecipes));
              setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);

              if (newRecipes.length < 1) {
                  console.log('No more recipes to fetch.');
                  setHasMore(false);
              }
          } catch (error) {
              console.error('Error fetching more recipes:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchMoreRecipes();
  }
}, [page]);




  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleTagChange = (e) => setSelectedTag(e.target.value);
  const handleDifficultyChange = (e) => setSelectedDifficulty(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const toggleExpanded = (id) => setExpandedRecipe(expandedRecipe === id ? null : id);

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

  const resetFiltersAndSort = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedDifficulty('');
    setSortOption('');
    setRecipes(allRecipes); // Reset to all recipes
  };
  useEffect(() => {
    const throttledScrollHandler = throttle(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight &&
            hasMore &&
            !loading
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    }, 200); // 200ms throttle interval

    window.addEventListener('scroll', throttledScrollHandler);

    return () => {
        window.removeEventListener('scroll', throttledScrollHandler);
        throttledScrollHandler.cancel(); // Cancel throttle when the component unmounts
    };
}, [hasMore, loading]);


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

        {/* Sort Options */}
        <select onChange={handleSortChange} value={sortOption}>
          <option value="">Sort by</option>
          <option value="title">Title</option>
          <option value="updateTime">Last Updated</option>
          <option value="difficulty">Difficulty</option>
        </select>

      {/* Reset Button */}
      <button onClick={resetFiltersAndSort} className="filter-options">
        Reset Filters and Sort
      </button>
      </div>

      <button onClick={handleSendEmail} className="btn-submit">
        Send Selected Recipes via Email
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="recipeList" direction="horizontal">
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="recipe-grid"
      >
        {recipes.map((recipe, index) => (
          <Draggable key={recipe.id} draggableId={String(recipe.id)} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="recipe-card"
              >
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
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>


    </div>
  );
};

export default RecipeList;
