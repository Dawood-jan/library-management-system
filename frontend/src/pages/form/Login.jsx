import React, { useContext, useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FilledInput from "@mui/material/FilledInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { auth } from "../../context/AuthContext";

const Login = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { loginUser, userAuth } = useContext(auth);

  const handleShowPassword = () => setShowPassword((show) => !show);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await loginUser(email, password);

      // console.log(res);

      if (!res.success) {
        setError(res.message);
      } else {
        setError(null);

        const role = res.payload.role;
        // console.log(role);
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 col-sm-6 col-6">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            className="shadow p-4 rounded"
          >
            <h2 className="text-center mb-4 text-dark">Login</h2>
            {error && (
              <Alert
                severity="error"
                style={{ display: "flex", alignItems: "center" }}
              >
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="filled"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              required
            />

            <FormControl variant="filled">
              <InputLabel
                htmlFor="filled-adornment-password"
                required
                sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              >
                Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
            <Link to="/forgot-password" className="text-underline">Forgot Password</Link>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Login;
