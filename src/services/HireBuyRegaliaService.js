import axios from "axios";

const API_URL = import.meta.env.VITE_GOWN_API_BASE;

export const getCeremonies = async () => {
  try {
    const response = await axios.get(`${API_URL}/ceremonies`);
    return response.data;
  } catch (err) {
    console.error("Error fetching ceremonies:", err);
    return [];
  }
};

export const getCoursesByCeremonyId = async (selectedCeremonyId) => {
  try {
    const response = await axios.get(`${API_URL}/degreesbyceremony/${selectedCeremonyId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    return [];
  }
};

export const getItemsByCourseId = async (selectedCourseId) => {
  try {
    const response = await axios.get(`${API_URL}/itemsbydegree/${selectedCourseId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    return [];
  }
};

export const getItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (err) {
    console.error("Error fetching items:", err);
    return [];
  }
};

export const getItemSets = async () => {
  try {
    const response = await axios.get(`${API_URL}/itemsets`);
    return response.data;
  } catch (err) {
    console.error("Error fetching item sets:", err);
    return [];
  }
};
