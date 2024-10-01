import api from "./api";

export const getLicensePlatesByUser = async () => {
  try {
    const response = await api.get("/user/license-plates");
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plates for user:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getLicensePlatesStatesByUser = async () => {
  try {
    const response = await api.get("/user/license-plates/states");
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plates states for user:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getLicensePlatesDetailsByUser = async () => {
  try {
    const response = await api.get("/user/license-plates/details");
    return response.data;
  } catch (error) {
    console.error("Error fetching license plates:", error);
    throw error;
  }
};

export const getLicensePlatesDetailsByUserAndState = async (
  state,
  page = 1,
  perPage = 10
) => {
  try {
    const response = await api.get(
      `/user/license-plates/details/state/${state}`,
      {
        params: { page, per_page: perPage },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plates for user and state ${state}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getUserLicensePlateById = async (id) => {
  try {
    const response = await api.get(`/user/license-plates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user license plate with id ${id}:`, error);
    throw error;
  }
};

export const favoriteUserLicensePlate = async (id, location) => {
  try {
    const response = await api.post(`/user/license-plates/${id}/favorite`, {
      location,
    });
    return response.data;
  } catch (error) {
    console.error(`Error favoriting license plate with id ${id}:`, error);
    throw error;
  }
};

export const unfavoriteUserLicensePlate = async (id) => {
  try {
    const response = await api.post(`/user/license-plates/${id}/unfavorite`);
    return response.data;
  } catch (error) {
    console.error(`Error unfavoriting license plate with id ${id}:`, error);
    throw error;
  }
};

export const seenUserLicensePlate = async (id, location) => {
  try {
    const response = await api.post(`/user/license-plates/${id}/seen`, {
      location,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error marking license plate with id ${licensePlateId} as seen:`,
      error
    );
    throw error;
  }
};

export const unseenUserLicensePlate = async (id) => {
  try {
    const response = await api.post(`/user/license-plates/${id}/unseen`);
    return response.data;
  } catch (error) {
    console.error(
      `Error marking license plate with id ${id} as unseen:`,
      error
    );
    throw error;
  }
};

export const batchUpdateUserLicensePlates = async (
  userSelections,
  location
) => {
  try {
    // Convert userSelections object to FormData
    const formData = new FormData();
    for (const [key, value] of Object.entries(userSelections)) {
      formData.append(`userSelections[${key}]`, JSON.stringify(value));
    }

    // Add location to FormData
    formData.append("location", location);

    const response = await api.post(
      `/user/license-plates/batch-update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error batch updating license plates:`, error);
    throw error;
  }
};
