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

export const submitOrderDetails = async (items) => {
  try {
    const orderPayload = {
      items: items,
      orderDate: new Date().toISOString(),
    };

    const response = await axios.post(`${API_URL}/items`, orderPayload);
    console.log('Order submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error.response?.data || error.message);
    throw error;
  }
};

export const submitCustomerDetails = async (formData) => {
  try {
    const customerPayload = {
      ...formData,
      orderDate: new Date().toISOString(),
      Paid: false
    };

    const response = await axios.post(`${API_URL}/orders`, customerPayload);
    console.log('Customer details submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting customer details:', error.response?.data || error.message);
    throw error;
  }
};