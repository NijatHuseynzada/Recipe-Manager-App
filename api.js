import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchRecipes = () => axios.get(`${API_URL}/recipes`);


export const fetchRecipeById = (id) => axios.get(`${API_URL}/recipes/${id}`);

export const createRecipe = (data) => axios.post(`${API_URL}/recipes`, data);

export const updateRecipe = (id, data) => axios.put(`${API_URL}/recipes/${id}`, data);

export const deleteRecipe = (id) => axios.delete(`${API_URL}/recipes/${id}`);

export const sendMessage = (message) => axios.post(`${API_URL}/messages`, message);

export const fetchRecipesPaginated = async (page, limit, sortOption) => {
  try {
      const params = {
          _page: page,
          _limit: limit,
          ...(sortOption && { _sort: sortOption, _order: 'asc' }), // Include sorting if selected
      };
      const response = await axios.get(`${API_URL}/recipes`, { params });
      return response.data;
  } catch (error) {
      console.error('Error fetching paginated recipes:', error);
      throw error;
  }
};


export const updateRecipesOrder = async (recipes) => {
  try {
    const updatePromises = recipes.map((recipe) =>
      axios.put(`${API_URL}/recipes/${recipe.id}`, { ...recipe, order: recipe.order })
    );
    await Promise.all(updatePromises);
    return { success: true };
  } catch (error) {
    console.error('ailed to update recipe order:', error.response || error);
    throw error;
  }
};
