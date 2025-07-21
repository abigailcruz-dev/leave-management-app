import axios from "axios";

const baseURL = "http://localhost:8000/api"; 

const authAxios = axios.create({
  baseURL,
});

authAxios.interceptors.request.use(
  async (config) => {
    let access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (isTokenExpired(access) && refresh) {
      try {
        const res = await axios.post(`${baseURL}/token/refresh/`, {
          refresh,
        });
        access = res.data.access;
        localStorage.setItem("access", access);
      } catch (err) {
        console.error("Session expired.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    config.headers.Authorization = `Bearer ${access}`;
    return config;
  },
  (error) => Promise.reject(error)
);

function isTokenExpired(token) {
  if (!token) return true;
  const [, payloadBase64] = token.split(".");
  const payload = JSON.parse(atob(payloadBase64));
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export default authAxios;
