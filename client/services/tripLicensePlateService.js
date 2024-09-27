import api from "./api";

export const getTripLicensePlatesByTrip = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/license-plates`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plates for trip ${tripId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getTripLicensePlateDetailsByTrip = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/license-plates/details`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plate details for trip ${tripId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getTripLicensePlateById = async (tripId, licensePlateId) => {
  try {
    const response = await api.get(
      `/trips/${tripId}/license-plates/${licensePlateId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching license plate with id ${licensePlateId} for trip ${tripId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const createTripLicensePlate = async (tripId, licensePlateData) => {
  try {
    const response = await api.post(`/trips/${tripId}/license-plates`, {
      ...licensePlateData,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error creating license plate for trip ${tripId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteTripLicensePlate = async (licensePlateId) => {
  try {
    const response = await api.delete(
      `/trips/license-plates/${licensePlateId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting license plate with id ${licensePlateId}:`,
      error
    );
    throw error;
  }
};
