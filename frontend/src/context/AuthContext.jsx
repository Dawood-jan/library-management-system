import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

export const auth = createContext();

const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")) || null,
  profilePhoto: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_SUCCESS": {
      return {
        ...state,
        userAuth: action.payload,
      };
    }

    case "LOGIN_SUCCESS": {
      localStorage.setItem("userAuth", JSON.stringify(action.payload));
      return {
        ...state,
        userAuth: action.payload,
      };
    }

    case "UPDATE_PASSWORD_SUCCESS": {
      // localStorage.setItem("userAuth", JSON.stringify(action.payload));
      return {
        ...state,
        userAuth: action.payload,
      };
    }

    case "PROFILE_SUCCESS": {
      return {
        ...state,
        userAuth: {
          ...state.userAuth,
          ...action.payload,
        },
      };
    }

    case "PROFILE_PHOTO_SUCCESS": {
      return {
        ...state,
        profilePhoto: action.payload,
      };
    }

    case "GET_PROFILE_PHOTO_SUCCESS": {
      return {
        ...state,
        profilePhoto: action.payload,
      };
    }

    case "UPDATE_PROFILE_SUCCESS": {
      const updatedUserAuth = {
        ...state.userAuth,
        user: {
          ...state.userAuth.user,
          ...action.payload, // Merge updated user fields
        },
      };

      // Update the localStorage with the modified userAuth object
      localStorage.setItem("userAuth", JSON.stringify(updatedUserAuth));

      return {
        ...state,
        userAuth: updatedUserAuth,
      };
    }

    case "LOGOUT_SUCCESS": {
      localStorage.removeItem("userAuth");
      return {
        ...state,
        userAuth: null,
      };
    }

    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  // Sync userAuth from localStorage when the provider initializes
  useEffect(() => {
    const savedAuth = localStorage.getItem("userAuth");

    if (savedAuth && !state.userAuth) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: JSON.parse(savedAuth),
      });
    }
  }, []);

  const registerUser = async (name, email, password, confirmPassword) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signup`,
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );
      console.log(response);

      if (response.data.success) {
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: response.data,
        });
        return { success: true, payload: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });
        return { success: true, payload: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const forgotPassword = async (email, password, confirmPassword) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/forgot-password`,
        {
          email,
          password,
          confirmPassword,
        }
      );
      console.log(response);

      if (response.data.success) {
        dispatch({
          type: "UPDATE_PASSWORD_SUCCESS",
          payload: response.data,
        });
        return { success: true, payload: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update password failed",
      };
    }
  };

  const profile = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("userAuth"));
      // console.log(auth.token);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // console.log(response.data);

      if (response.status === 200) {
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: response.data,
        });
        return { success: true, payload: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile failed",
      };
    }
  };

  const profileImage = async (file) => {
    try {
      const auth = JSON.parse(localStorage.getItem("userAuth"));
      const formData = new FormData();
      formData.append("profilePhoto", file);
      // console.log(formData);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/profile-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // console.log(response);

      if (response.status === 200) {
        dispatch({
          type: "PROFILE_PHOTO_SUCCESS",
          payload: response.data,
        });
        return { success: true, payload: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile photo failed",
      };
    }
  };

  const getprofilePhoto = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("userAuth"));
      // formData.append("profilePhoto", file);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile-photo`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // console.log(response.data.Base_Url);

      if (response.status === 200) {
        dispatch({
          type: "GET_PROFILE_PHOTO_SUCCESS",
          payload: response.data.Base_Url,
        });
        return { success: true, payload: response.data.Base_Url };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile photo failed",
      };
    }
  };

  const updateProfile = async (
    name,
    email,
    oldPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      const auth = JSON.parse(localStorage.getItem("userAuth"));
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-profile`,
        {
          name,
          email,
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // console.log(response.data);

      if (response.status === 200) {
        dispatch({
          type: "UPDATE_PROFILE_SUCCESS",
          payload: response.data,
        });

        return { success: true, payload: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update profile failed",
      };
    }
  };

  const logout = async () => {
    try {
      dispatch({
        type: "LOGOUT_SUCCESS",
      });
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed",
      };
    }
  };

  return (
    <auth.Provider
      value={{
        ...state,
        registerUser,
        loginUser,
        forgotPassword,
        logout,
        profile,
        profileImage,
        getprofilePhoto,
        updateProfile,
      }}
    >
      {children}
    </auth.Provider>
  );
};

export default AuthProvider;
