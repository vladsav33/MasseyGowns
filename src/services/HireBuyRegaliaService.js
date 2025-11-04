import axios from "axios";

// const API_URL = import.meta.env.VITE_GOWN_API_BASE;
const API_URL = 'https://localhost:7185';

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
    const response = await axios.get(
      `${API_URL}/degreesbyceremony/${selectedCeremonyId}`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    return [];
  }
};

export const getItemsByCourseId = async (selectedCourseId) => {
  try {
    const response = await axios.get(
      `${API_URL}/itemsbydegree/${selectedCourseId}`
    );
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

export const getDelivery = async () => {
  try {
    const response = await axios.get(`${API_URL}/delivery`);
    return response.data;
  } catch (err) {
    console.error("Error fetching delivery data:", err);
    return [];
  }
}

export const submitCustomerDetails = async (formData) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const ceremonyId = parseInt(JSON.parse(localStorage.getItem("selectedCeremonyId")) || 0);
    const degreeId = parseInt(JSON.parse(localStorage.getItem("selectedCourseId")) || 0);

    const customerPayload = {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      address: formData.address || "",
      city: formData.city || "",
      postcode: formData.postcode || "",
      country: formData.country || "NZ",
      phone: formData.phone || "",
      mobile: formData.mobile || "",
      studentId: parseInt(formData.studentId) || 0,
      message: formData.message || "",
      items: cart.map((item) => ({
        itemId: parseInt(item.id?.toString()) || 0,
        sizeId: parseInt(item.selectedOptions?.["Head Size"]) || parseInt(item.selectedOptions?.["Gown Size"]) || 0,
        fitId: parseInt(item.selectedOptions?.["My full height"]) || 0,
        hoodId: parseInt(item.selectedOptions?.["Hood Type"]) || 0,
        hire: item.isHiring ?? false,
        quantity: item.quantity || 1,
      })),
      paid: false,
      paymentMethod: parseInt(formData.paymentMethod) || 1,
      purchaseOrder: formData.purchaseOrder || "",
      orderDate: new Date().toISOString().split("T")[0],
      ceremonyId: ceremonyId,
      degreeId: degreeId
    };

    const response = await axios.post(`${API_URL}/orders`, customerPayload);
    if (response.data) {
      localStorage.setItem("orderResponse", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    console.error("Payload sent:", customerPayload);
    throw error;
  }
};

export const updatePaidStatus = async () => {
  try {
    const orderResponse = JSON.parse(
      localStorage.getItem("orderResponse") || "[]"
    );

    if (!orderResponse || !orderResponse.id) {
      console.error("No valid order found in localStorage");
      return;
    }

    const updatedOrder = {
      ...orderResponse,
      paid: true,
    };

    const response = await axios.put(
      `${API_URL}/orders/${orderResponse.id}`,
      updatedOrder
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};
