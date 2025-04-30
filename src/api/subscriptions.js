import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/subscriptions";

export const getSubscriptions = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
