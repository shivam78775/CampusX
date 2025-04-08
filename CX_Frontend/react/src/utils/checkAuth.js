// utils/checkAuth.js
import axios from "axios";

export const checkAuth = async () => {
  try {
    const res = await axios.get("http://localhost:4444/api/v1/user/me", {
      withCredentials: true,
    });
    return res.data; // authenticated user data
  } catch (err) {
    return null; // not authenticated
  }
};
