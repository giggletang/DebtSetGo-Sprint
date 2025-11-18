import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8080/api" });
const API_BASE = "http://localhost:8080/api";

// Goals
export const createGoal = (data) => API.post("/goals", data).then(r => r.data);
export const getGoal = (id) => API.get(`/goals/${id}`).then(r => r.data);

// Budget
export const addExpense = (data) => API.post("/budget/expense", data).then(r => r.data);
export const getSuggestions = (id) => API.get(`/budget/${id}/suggestions`).then(r => r.data);
export const getTransactions = (budgetId) => API.get(`/budget/${budgetId}/transactions`).then(r => r.data);

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

  // Profile
export const getProfile = (userId) =>
  API.get(`/profile/${userId}`).then((r) => r.data);

export const updateProfile = (userId, data) =>
  API.put(`/profile/${userId}`, data).then((r) => r.data);

export const estimateStateTax = (payload) =>
  API.post("/tax/estimate", payload).then((r) => r.data);

export const recommendInvestments = (payload) =>
  API.post("/investments/recommend", payload).then((r) => r.data);

export const getLibraryTopics = () =>
  API.get("/library").then((r) => r.data);

export const getLibraryArticle = (id) =>
  API.get(`/library/${id}`).then((r) => r.data);

export const getCreditCoachingPlan = (payload) =>
  API.post("/credit/coach", payload).then((r) => r.data);

export const getForumMessages = () =>
  API.get("/forum/messages").then((r) => r.data);

export const sendForumMessage = (payload) =>
  API.post("/forum/messages", payload).then((r) => r.data);

export const compareWhatIf = (payload) =>
  API.post("/whatif/compare", payload).then((r) => r.data);

export const getMembershipStatus = (userId) =>
  API.get(`/membership/status/${userId}`).then((r) => r.data);

export const purchaseMembership = (payload) =>
  API.post("/membership/purchase", payload).then((r) => r.data);

