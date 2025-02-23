import axios from "axios";

const API_URL = "http://localhost:3000/api/books";

export const fetchBooks = async () => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};
