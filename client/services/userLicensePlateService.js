import api from "./api";

export const getLicensePlatesByUser = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/license-plates`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plates for user with id ${userId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getUserLicensePlate = async (id) => {
  try {
    const response = await api.get(`/user/license-plate/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user license plate with id ${id}:`, error);
    throw error;
  }
};

export const favoriteLicensePlate = async (id) => {
  try {
    const response = await api.post(`/license-plate/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error(`Error favoriting license plate with id ${id}:`, error);
    throw error;
  }
};

export const unfavoriteLicensePlate = async (id) => {
  try {
    const response = await api.post(`/license-plate/${id}/unfavorite`);
    return response.data;
  } catch (error) {
    console.error(`Error unfavoriting license plate with id ${id}:`, error);
    throw error;
  }
};

export const seenLicensePlate = async (id) => {
  try {
    const response = await api.post(`/license-plate/${id}/seen`);
    return response.data;
  } catch (error) {
    console.error(
      `Error marking license plate with id ${licensePlateId} as seen:`,
      error
    );
    throw error;
  }
};

export const unseenLicensePlate = async (id) => {
  try {
    const response = await api.delete(`/license-plate/${id}/unseen`);
    return response.data;
  } catch (error) {
    console.error(
      `Error marking license plate with id ${id} as unseen:`,
      error
    );
    throw error;
  }
};
