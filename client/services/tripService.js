import api from "./api";

export const getTripsByUser = async () => {
  try {
    const response = await api.get("/trips");
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching trips for user:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const createTrip = async (trip) => {
  try {
    const response = await api.post("/trips", trip);
    return response.data;
  } catch (error) {
    console.error(
      `Error creating trip:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateTrip = async (trip) => {
  try {
    const response = await api.patch(`/trips/${trip.id}`, trip);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating trip with id ${trip.id}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteTrip = async (id) => {
  try {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting trip with id ${id}:`, error);
    throw error;
  }
};
