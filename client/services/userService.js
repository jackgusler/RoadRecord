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
    throw error;
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
    throw error;
  }
};

export const updateUser = async (id, formData) => {
  try {
    // Append the `_method` field to the form data to simulate a PATCH request
    formData.append('_method', 'PATCH');

    const response = await api.post(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
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
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/current");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching current user:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
