import axios, { AxiosError } from "axios";

export const API_URL = "http://localhost:5000/users";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{message: string}>;
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  phone: number,
  image: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      phone,
      image
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{message: string}>;
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};
