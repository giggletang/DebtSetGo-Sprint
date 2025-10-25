import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8080/api" });
const API_BASE = "http://localhost:8080/api";

// Goals
export const createGoal = (data) => API.post("/goals", data).then(r => r.data);
export const getGoal = (id) => API.get(`/goals/${id}`).then(r => r.data);

// Budget
export const addExpense = (data) => API.post("/budget/expense", data).then(r => r.data);
export const getSuggestions = (id) => API.get(`/budget/${id}/suggestions`).then(r => r.data);

// register and login

export const register = async (data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  };
  
  export const login = async (data) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  };