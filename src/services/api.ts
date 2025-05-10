import axios from "axios";

const api = axios.create({
  baseURL: "https://api-v3.mbta.com",
});

export default api;
