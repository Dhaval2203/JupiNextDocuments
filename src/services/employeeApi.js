import API from './api';

export const getEmployees = () => API.get('/employees');

export const addEmployee = (payload) =>
    API.post('/employees', payload);

export const updateEmployee = (id, payload) =>
    API.put(`/employees/${id}`, payload);
