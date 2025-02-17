import React, { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { auth } from "../../context/AuthContext";
import { Alert } from "@mui/material";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const { updateProfile } = useContext(auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { name, email, oldPassword, newPassword, confirmNewPassword } =
      formData;

    try {
      const res = await updateProfile(
        name,
        email,
        oldPassword,
        newPassword,
        confirmNewPassword
      );
      // console.log(res.payload);
      if (res.success) {
        // console.log("Profile updated successfully!");
        await swal("Success", "Profile updated successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        setFormData({
          name: "",
          email: "",
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setError(null);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, p: 2, m: "auto" }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        className="text-center"
      >
        Update Profile
      </Typography>

      {error && (
        <Alert
          severity="error"
          style={{ display: "flex", alignItems: "center" }}
        >
          {error}
        </Alert>
      )}

      <div>
        <TextField
          label="Full Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Old Password"
          name="oldPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.oldPassword}
          onChange={handleChange}
        />

        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.newPassword}
          onChange={handleChange}
        />
        <TextField
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.confirmNewPassword}
          onChange={handleChange}
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ mt: 2 }}
      >
        Update Profile
      </Button>
    </Card>
  );
};

export default UpdateProfile;
