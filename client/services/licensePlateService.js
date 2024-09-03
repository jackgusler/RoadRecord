import api from "./api";

export const getLicensePlatesByState = async (state, page = 1, perPage = 10) => {
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
