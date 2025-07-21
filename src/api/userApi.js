import axios from "axios";
import API_BASE_URL from "./apibase";

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
//  Dynamically pass update URL from config
export const updateUser = (id, userData, updateUrlFromConfig) => {
  const url = `${API_BASE_URL}${updateUrlFromConfig.replace(":id", id)}`;
  return axios.put(url, userData);
};

export const getUserById = (url) => {
  return axios.get(url);
};