import axios from "axios";

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const response = await axios.post("http://localhost:8000/api/token/refresh/", {
      refresh: refresh,
    });

    const newAccess = response.data.access;
    localStorage.setItem("access", newAccess); 
    return newAccess;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};
