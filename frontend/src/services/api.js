import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const getActivities = async (filters = {}) => {
    const response = await api.get('/activities', { params: filters });
    return response.data;
};

export const createActivity = async (activity) => {
    const response = await api.post('/activities', activity);
    return response.data;
};

export const deleteActivity = async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
};

export const getStats = async (startDate, endDate) => {
    const response = await api.get('/stats', { params: { start_date: startDate, end_date: endDate } });
    return response.data;
};

export const getRecommendations = async () => {
    const response = await api.get('/recommendations');
    return response.data;
};

export const simulateClimate = async (scenario) => {
    const response = await api.post('/climate/simulate', scenario);
    return response.data;
};
