import axios from 'axios';
import { API_URL } from '../config/config';
import authHeader from './authHeader';

// Get all policies with filtering
export const getAllPolicies = async (filters = {}) => {
  try {
    console.log('Making API request to fetch policies with filters:', filters);
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_URL}/policies`, {
      params: {
        ...filters,
        _t: timestamp
      },
      headers: {
        ...authHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'If-Modified-Since': '0'
      },
      withCredentials: true
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getAllPolicies:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch policies');
    }
    throw new Error('Network error while fetching policies');
  }
};

// Get policy statistics
export const getPolicyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/policies/stats`, {
      headers: authHeader(),
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
      headers: authHeader(),
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
      headers: authHeader(),
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
    console.log('Making API request to create policy:', policyData);
    const response = await axios.post(`${API_URL}/policies`, policyData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createPolicy:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to create policy');
    }
    throw new Error('Network error while creating policy');
  }
};

// Update a policy
export const updatePolicy = async (id, policyData) => {
  try {
    const response = await axios.put(`${API_URL}/policies/${id}`, policyData, {
      headers: authHeader(),
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
      headers: authHeader(),
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
      headers: authHeader(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add sendRenewalReminder function
export const sendRenewalReminder = async (id) => {
  try {
    console.log('Making API request to send renewal reminder for policy:', id);
    const response = await axios.post(`${API_URL}/policies/${id}/renewal-reminder`, {}, {
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in sendRenewalReminder:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to send renewal reminder');
    }
    throw new Error('Network error while sending renewal reminder');
  }
}; 