import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ladivyn_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set axios default auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          const res = await axios.get("http://localhost:5001/api/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Auth initialization failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });
      
      const { token: receivedToken, ...userData } = res.data;
      
      setToken(receivedToken);
      setUser(userData);
      localStorage.setItem("ladivyn_token", receivedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
      
      return { success: true };
    } catch (err) {
      console.error("Login Error:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || "Invalid email or password" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", userData);
      
      const { token: receivedToken, ...userResult } = res.data;
      
      setToken(receivedToken);
      setUser(userResult);
      localStorage.setItem("ladivyn_token", receivedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
      
      return { success: true };
    } catch (err) {
      console.error("Registration Error:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || "Registration failed. Email might already exist." 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ladivyn_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
