import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you are using toastify for notifications

const API_URL = 'http://localhost:8000/api'; // Django backend URL
const BASE_URL = 'http://127.0.0.1:8000/api';

// Create an Axios instance with default headers
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include the token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage or another method
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor to handle errors and success globally
axiosInstance.interceptors.response.use(
    (response) => response, // Handle response normally
    (error) => {
        // Handle error globally
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message || error.response.statusText;

            // Handle 401 (Unauthorized) - Token expired or invalid
            if (status === 401) {
                toast.error('Session expired. Please log in again.');
                window.location.href = '/login'; // Redirect to login page
            }

            // Handle other error statuses
            else if (status === 403) {
                toast.error('You do not have permission to access this resource.');
            } else {
                toast.error(`Error: ${message}`);
            }
        } else {
            toast.error('Network Error or Server not reachable');
        }
        return Promise.reject(error);
    }
);

// API Calls
export const signup = (userData) => axiosInstance.post('/auth/signup/', userData);

export const login = (credentials) => axiosInstance.post('/auth/login/', credentials);