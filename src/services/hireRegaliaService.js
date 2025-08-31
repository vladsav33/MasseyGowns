import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCeremonies = async () => {
  try {
    const response = await axios.get(`${API_URL}/ceremonies`);
    return response.data;
  } catch (err) {
    console.error("Error fetching ceremonies:", err);
    return [];
  }
};
