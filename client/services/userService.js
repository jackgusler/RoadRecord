// services/userService.js
import api from "./api"; // Adjust the path to where your Axios instance is

export const getUsers = async () => {
  console.log("getUsers");
  try {
    const response = await api.get("/users");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error if you need to handle it further up the chain
  }
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};
