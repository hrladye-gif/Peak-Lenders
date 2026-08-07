import api from "./api";


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

                                                                    localStorage.setItem(
                                                                            "token",
                                                                                    response.data.token
                                                                                        );

                                                                                            return response.data;
                                                                                            };



                                                                                            export const register = async (
                                                                                                data: {
                                                                                                        first_name: string;
                                                                                                                last_name: string;
                                                                                                                        email: string;
                                                                                                                                password: string;
                                                                                                                                        role?: string;
                                                                                                                                            }
                                                                                                                                            ) => {

                                                                                                                                                const response = await api.post(
                                                                                                                                                        "/auth/register",
                                                                                                                                                                {
                                                                                                                                                                            ...data,
                                                                                                                                                                                        role: data.role || "admin"
                                                                                                                                                                                                }
                                                                                                                                                                                                    );

                                                                                                                                                                                                        return response.data;
                                                                                                                                                                                                        };



                                                                                                                                                                                                        export const logout = () => {

                                                                                                                                                                                                            localStorage.removeItem(
                                                                                                                                                                                                                    "token"
                                                                                                                                                                                                                        );

                                                                                                                                                                                                                        };



                                                                                                                                                                                                                        export const isAuthenticated = () => {

                                                                                                                                                                                                                            return Boolean(
                                                                                                                                                                                                                                    localStorage.getItem("token")
                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                        