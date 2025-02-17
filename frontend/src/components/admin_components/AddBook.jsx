import React, { useState, useEffect, useContext, useRef } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import axios from "axios";
import { auth } from "../../context/AuthContext";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
  });
  const [file, setFile] = useState("");
  const [pdf, setPdf] = useState("");
  const [category, setCategory] = useState("");
  const quillAbstractRef = useRef(null);
  const quillAbstractInstance = useRef(null);
  const [abstract, setAbstract] = useState("");
  const [error, setError] = useState(null);
  const { userAuth } = useContext(auth);

  useEffect(() => {
    // Quill for Instructions
    if (!quillAbstractInstance.current && quillAbstractRef.current) {
      quillAbstractInstance.current = new window.Quill(
        quillAbstractRef.current,
        {
          theme: "snow",
          placeholder: "Abstract",
          modules: {
            toolbar: [
              ["bold", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }
      );

      quillAbstractInstance.current.on("text-change", () => {
        setAbstract(quillAbstractInstance.current.root.innerHTML);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
  };

  const handlePdfChange = (e) => {
    const pdfFile = e.target.files[0];
    console.log(pdfFile);
    setPdf(pdfFile);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    console.log(userAuth);
    e.preventDefault();

    try {
      const { title, author, isbn } = formData;
      const data = new FormData();
      data.append("title", title);
      data.append("author", author);
      data.append("isbn", isbn);
      data.append("abstract", abstract);
      data.append("genre", category);

      if (file) {
        data.append("file", file);
      }

      if (pdf) {
        data.append("pdfFile", pdf);
      }

      // console.log(data);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/library/add-book`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log(response);

      if (response.status === 200) {
        await swal("Success", "Recipe created waiting for approval!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });

        setFormData({
          title: "",
          author: "",
          isbn: "",
        });
        setCategory("");
        setFile("");
        setPdf("");
        document.getElementById("file-input").value = "";
        document.getElementById("book-input").value = "";
        // Reset Quill editors
        if (quillAbstractInstance.current) {
          quillAbstractInstance.current.setText("");
        }
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
      <style>
        {`
          .ql-container {
            height: 150px !important;
          }
          .ql-editor.ql-blank::before {
            font-style: normal !important;
            font-size: 20px;
            padding: 0 !important;
            content: attr(data-placeholder);
          }

          .ql-editor {
            padding: 10px 8px;
          }

          .ql-hover:hover {
          border: "1px solid #202021"
          }
        `}
      </style>

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
            <h2 className="text-center mb-4 text-dark">Add a New Book</h2>
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
              label="Title"
              sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              required
              variant="filled"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Author"
              required
              sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              type="author"
              variant="filled"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="ISBN"
              required
              sx={{ "& .MuiInputLabel-asterisk": { color: "red" } }}
              type="isbn"
              variant="filled"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />

            <div className="mb-3">
              <label className="form-label">
                Abstract <span className="text-danger">*</span>
              </label>
              <div
                ref={quillAbstractRef}
                className="form-control ql-container ql-editor"
              ></div>
            </div>

            {/* Category Select */}
            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Genre <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="category"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Genre</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="fiction">Fiction</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="file-input" className="form-label">
                Upload Image <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                id="file-input"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="book-input" className="form-label">
                Upload Book <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                id="book-input"
                onChange={handlePdfChange}
              />
            </div>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
