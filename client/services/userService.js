// services/userService.js
import api from "./api"; // Adjust the path to where your Axios instance is

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
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
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching user with id ${id}:`,
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error if you need to handle it further up the chain
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error if you need to handle it further up the chain
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating user with id ${id}:`,
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error if you need to handle it further up the chain
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error(
      `Error deleting user with id ${id}:`,
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error if you need to handle it further up the chain
  }
};
