import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.withCredentials = true; // ✅ Required for cookies/sessions

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // ✅ use null not false

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true); // ✅ Set login true when user data is fetched
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    // ❌ Removed call to getAuthState
    // ✅ Optional: call getUserData directly if that's how you check login
    // getUserData(); 
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
