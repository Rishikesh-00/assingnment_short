import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

export const createShortUrl = (data) => API.post("/links", data);
export const getAllLinks = () => API.get("/links");
export const getLinkStats = (code) => API.get(`/links/${code}`);
export const deleteLink = (code) => API.delete(`/links/${code}`);
