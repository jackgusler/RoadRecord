import api from "./api";

export const getLicensePlate = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get("/license-plates", {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching license plates:", error);
    throw error;
  }
};

export const getLicensePlatesById = async (id, page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/license-plates/${id}`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching license plates:", error);
    throw error;
  }
};

export const getLicensePlatesByState = async (
  state,
  page = 1,
  perPage = 10
) => {
  try {
    const response = await api.get(`/license-plates/${state}`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching license plates:", error);
    throw error;
  }
};

export const searchLicensePlates = async (query, page = 1, perPage = 10) => {
  try {
    const response = await api.get("/license-plates/search", {
      params: { search: query, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching license plates:", error);
    throw error;
  }
};
