import axios from 'axios';
import { API_URL } from '../config/config';

// Get all policies with filtering
export const getAllPolicies = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/policies`, {
      params: filters,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get policy statistics
export const getPolicyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/policies/stats`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get leads for policy conversion
export const getLeadsForPolicy = async (search = '') => {
  try {
    const response = await axios.get(`${API_URL}/policies/leads`, {
      params: { search },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a single policy
export const getPolicyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/policies/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new policy
export const createPolicy = async (policyData) => {
  try {
    const response = await axios.post(`${API_URL}/policies`, policyData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

// Update a policy
export const updatePolicy = async (id, policyData) => {
  try {
    const response = await axios.put(`${API_URL}/policies/${id}`, policyData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a policy
export const deletePolicy = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/policies/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update policy status
export const updatePolicyStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/policies/${id}/status`, { status }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 