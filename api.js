import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const getRecipes = () => axios.get(`${API_BASE}/recipes`);
export const createRecipe = (data) => axios.post(`${API_BASE}/recipes`, data);
export const updateRecipe = (id, data) => axios.put(`${API_BASE}/recipes/${id}`, data);
export const deleteRecipe = (id) => axios.delete(`${API_BASE}/recipes/${id}`);
export const sendMessage = (data) => axios.post(`${API_BASE}/messages`, data);
