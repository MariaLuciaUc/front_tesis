// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // La URL de tu servidor Laravel + /api
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;