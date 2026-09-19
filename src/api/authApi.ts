import axios from 'axios';
import {getToken} from '../utils/authStorage';
const API_URL = 'http://192.168.1.19:8000/api';

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

export const getProfile = async () => {
  const token = await getToken();

  const response = await axios.get(
    `${API_URL}/users/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const updateProfile = async (
  name: string,
  email: string,
) => {
  const token = await getToken();

  const response = await axios.put(
    `${API_URL}/users/profile`,
    {
      name,
      email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};


export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const token = await getToken();

  const response = await axios.put(
    `${API_URL}/users/change-password`,
    {
      currentPassword,
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};