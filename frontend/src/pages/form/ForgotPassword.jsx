import React, { useContext, useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FilledInput from "@mui/material/FilledInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { auth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { forgotPassword } = useContext(auth);

  const handleShowPassword = () => setShowPassword((show) => !show);

  const handleShowConfirmPassword = () =>
    setConfirmShowPassword((showConfirmPassword) => !showConfirmPassword);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time password strength validation
    if (name === "password") {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (strongRegex.test(password)) {
      setPasswordStrength("strong");
    } else if (mediumRegex.test(password)) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password, confirmPassword } = formData;
      // Call the registerUser function
      const res = await forgotPassword(email, password, confirmPassword);

      console.log(res.success);
      if (res.success) {
        // If registration fails, set the error message from the backend
        navigate("/login");
      } else {
        setError(res?.message);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 col-sm-7 col-7">
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
            <h2 className="text-center mb-4 text-dark">Forgot Password</h2>
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
              InputLabelProps={{
                sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
              }}
              variant="filled"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormControl variant="filled">
              <InputLabel
                htmlFor="filled-adornment-password"
                required
                sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              >
                New Password
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

            {/* Password Strength Meter */}
            <div className="">
              <div className="progress">
                <div
                  className={`progress-bar ${
                    passwordStrength === "weak"
                      ? "bg-danger"
                      : passwordStrength === "medium"
                      ? "bg-warning"
                      : passwordStrength === "strong"
                      ? "bg-success"
                      : ""
                  }`}
                  role="progressbar"
                  style={{
                    width:
                      passwordStrength === "weak"
                        ? "33%"
                        : passwordStrength === "medium"
                        ? "66%"
                        : passwordStrength === "strong"
                        ? "100%"
                        : "0%",
                    transition: "width 0.3s ease-in-out",
                  }}
                ></div>
              </div>
            </div>

            <FormControl variant="filled">
              <InputLabel
                htmlFor="filled-adornment-confirm-password"
                required
                sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              >
                Confirm New Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
