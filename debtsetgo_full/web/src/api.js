import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8080/api" });

// Goals
export const createGoal = (data) => API.post("/goals", data).then(r => r.data);
export const getGoal = (id) => API.get(`/goals/${id}`).then(r => r.data);

// Budget
export const addExpense = (data) => API.post("/budget/expense", data).then(r => r.data);
export const getSuggestions = (id) => API.get(`/budget/${id}/suggestions`).then(r => r.data);
