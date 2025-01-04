import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchRecipes = () => axios.get(`${API_URL}/recipes`);

export const fetchRecipeById = (id) => axios.get(`${API_URL}/recipes/${id}`);

export const createRecipe = (data) => axios.post(`${API_URL}/recipes`, data);

export const updateRecipe = (id, data) => axios.put(`${API_URL}/recipes/${id}`, data);

export const deleteRecipe = (id) => axios.delete(`${API_URL}/recipes/${id}`);

export const sendMessage = (message) => axios.post(`${API_URL}/messages`, message);

export const fetchRecipesPaginated = async (page, limit) => {
  const response = await axios.get(`http://localhost:3000/recipes?_page=${page}&_limit=${limit}`);
  return response.data;
};
