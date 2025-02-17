import React, { useState, useContext, useRef } from "react";
import { Button, Box, Alert } from "@mui/material";
import axios from "axios";
import { auth } from "../../context/AuthContext";

const ResetFine = () => {
  const [file, setFile] = useState("");
  const [error, setError] = useState(null);
  const { userAuth } = useContext(auth);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setFile(file);
  };

  // console.log(userAuth.token)

  const handleSubmit = async (e) => {
    console.log(userAuth);
    e.preventDefault();

    try {
      // console.log(userAuth.token)
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/library/submit-fine`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        await swal("Success", "Fine sent successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });

        document.getElementById("file-input").value = "";
      } else {
        console.log(response);
        setError(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message);
    }
  };

  return (
    <div className="container p-6 ">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-5 col-sm-8 col-8">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              background: "white",
              gap: 2,
            }}
            className="shadow p-4 rounded"
          >
            <h2 className="text-center mb-4">Submit Fine</h2>
            {error && (
              <Alert
                severity="error"
                style={{ display: "flex", alignItems: "center" }}
              >
                {error}
              </Alert>
            )}

            <div className="mb-3">
              <label htmlFor="file-input" className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                className="form-control"
                id="file-input"
                onChange={handleFileChange}
              />
            </div>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ResetFine;
