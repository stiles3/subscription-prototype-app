import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export const updateWebhookUrl = async ({ webhookUrl, id }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/${id}/webhook`,
      { webhookUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
