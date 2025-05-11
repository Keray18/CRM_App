import axios from 'axios';
import { API_URL } from '../config/config';

// Get all customers with filtering
export const getAllCustomers = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/customers`, {
      params: filters,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a single customer
export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/customers`, customerData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a customer
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_URL}/customers/${id}`, customerData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 