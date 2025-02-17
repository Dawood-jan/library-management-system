import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../../context/AuthContext";
import { Alert } from "@mui/material";

const UpdateBook = () => {
  const { id } = useParams();
  const [bookeData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
  });
  const [category, setCategory] = useState("");
  const [abstract, setAbstract] = useState("");
  const quillAbstractRef = useRef(null);
  const quillAbstractInstance = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewBook, setPreviewBook] = useState("");
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const { userAuth } = useContext(auth);
  const navigate = useNavigate();

  // Fetch Recipe Data
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/library/all-book/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.token}`,
            },
          }
        );

        // console.log(response.data.bookFound);

        const { title, author, genre, abstract, isbn, bookPhoto, book } =
          response.data.bookFound;

        // Populate State
        setPreviewUrl(bookPhoto);
        setBookData({ title, author, genre, isbn });
        setCategory(genre);
        setAbstract(abstract);
        setFile(file);
        setPreviewBook(book);
        // setCurrentVideo(video);

        if (quillAbstractInstance.current) {
          quillAbstractInstance.current.root.innerHTML = abstract;
        }
      } catch (err) {
        setError("Failed to fetch book data");
        console.error(err);
      }
    };

    fetchBookData();
  }, [id, userAuth]);

  // Quill Editors Initialization
  useEffect(() => {
    if (!quillAbstractInstance.current && quillAbstractRef.current) {
      quillAbstractInstance.current = new window.Quill(
        quillAbstractRef.current,
        {
          theme: "snow",
          placeholder: "Abstract",
          modules: {
            toolbar: [
              ["bold", "underline", "strike"],
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
    setBookData({ ...bookeData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    const pdfFile = e.target.files[0];
    setPdf(pdfFile);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { title, author, isbn } = bookeData;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("abstract", abstract);
      formData.append("isbn", isbn);
      formData.append("genre", category);

      if (file) {
        formData.append("file", file);
      }

      if (pdf) {
        formData.append("pdfFile", pdf);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/library/all-book/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        await swal("Success", "Recipe updated successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        navigate("/admin-dashboard/available-books");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to update book");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <style>
        {`
          .ql-container {
            height: 150px !important;
          }
          .ql-editor.ql-blank::before {
            font-style: normal !important;
            font-size: 20px
            content: attr(data-placeholder);
          }

          .ql-hover:hover {
          border: "1px solid #202021"
          }
        `}
      </style>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
            <h2 className="mb-4 text-center text-dark">Edit Book</h2>

            {error && (
              <Alert
                severity="error"
                style={{ display: "flex", alignItems: "center" }}
              >
                {error}
              </Alert>
            )}

            {/* Title Input */}
            <div className="form-group mb-2">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Enter Title"
                value={bookeData.title}
                onChange={handleChange}
              />
            </div>

            {/* ISBN Input */}
            <div className="form-group mb-2">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="isbn"
                placeholder="Enter ISBN"
                value={bookeData.isbn}
                onChange={handleChange}
              />
            </div>

            {/* Quill Editor for Instructions */}
            <div className="form-group mb-2">
              <label>Abstract</label>
              <div ref={quillAbstractRef}></div>
            </div>

            {/* Preview Current Image */}
            {previewUrl && (
              <>
                <label>Current Image</label>
                <div className="form-group mb-2 text-center">
                  <img
                    src={previewUrl}
                    alt="Recipe Attachment"
                    className="img-fluid rounded mb-2"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              </>
            )}

            {/* File Input for Image */}
            <div className="form-group mb-2">
              <label htmlFor="file">Upload New Image</label>
              <input
                type="file"
                className="form-control-file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Preview Current Image */}
            {previewBook && (
              <>
                <label>Current Book</label>
                <div className="form-group mb-2 text-center">
                  <a
                    href={previewBook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-link"
                  >
                    View Current Book
                  </a>
                </div>
              </>
            )}

            {/* Book Upload */}
            <div className="mb-3">
              <label htmlFor="video-input" className="form-label">
                Upload Book
              </label>
              <input
                type="file"
                className="form-control"
                id="book-input"
                onChange={handlePdfChange}
              />
            </div>

            {/* Category Select Dropdown */}
            <div className="form-group mb-3">
              <label htmlFor="category">Category</label>
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

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Update Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
