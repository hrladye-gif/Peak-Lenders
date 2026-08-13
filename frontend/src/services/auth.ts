import { api } from "../api/axios";


export const login = async (
  email: string,
  password: string
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  if (response.data?.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );
  }

  if (response.data?.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};


export const register = async (
  data: {
    company_name: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("token")
  );
};
