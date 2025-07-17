import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const createUser = (userData) => {
  return axios.post(`${API_URL}/create`, userData);
};
export const loginUser = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const getAllUsers = () => {
  return axios.get(`${API_URL}/`);
};