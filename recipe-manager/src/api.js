import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchRecipes = () => axios.get(`${API_URL}/recipes`);
export const createRecipe = (data) => axios.post(`${API_URL}/recipes`, data);
export const sendMessage = (message) => axios.post(`${API_URL}/messages`, message);
