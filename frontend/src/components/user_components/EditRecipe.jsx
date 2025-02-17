import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../../context/AuthContext";
import { Alert } from "@mui/material";

const EditRecipe = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState({
    title: "",
  });
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const quillInstructionRef = useRef(null);
  const quillIngredientRef = useRef(null);
  const quillInstructionInstance = useRef(null);
  const quillIngredientInstance = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  // const [currentVideo, setCurrentVideo] = useState("");
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const { userAuth } = useContext(auth);
  const navigate = useNavigate();

  // Fetch Recipe Data
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/recipes/users-recipe/${id}`
          // {
          //   headers: {
          //     Authorization: `Bearer ${userAuth.user.token}`,
          //   },
          // }
        );

        // console.log(response.data);

        const { name, recipeType, instructions, ingredients, image } =
          response.data.recipeFound;

        //  const imageUrl = `${import.meta.env.VITE_BASE_URL}/${image}`;

        // console.log(previewUrl);

        // Populate State
        setPreviewUrl(image);
        setRecipeData({ title: name });
        setCategory(recipeType);
        setInstructions(instructions);
        setIngredients(ingredients);
        setFile(image);
        setVideo(video);
        // setCurrentVideo(video);

        if (quillInstructionInstance.current) {
          quillInstructionInstance.current.root.innerHTML = instructions;
        }

        if (quillIngredientInstance.current) {
          quillIngredientInstance.current.root.innerHTML = ingredients;
        }
      } catch (err) {
        setError("Failed to fetch recipe data");
        console.error(err);
      }
    };

    fetchRecipeData();
  }, [id, userAuth]);

  // Quill Editors Initialization
  useEffect(() => {
    if (!quillInstructionInstance.current && quillInstructionRef.current) {
      quillInstructionInstance.current = new window.Quill(
        quillInstructionRef.current,
        {
          theme: "snow",
          placeholder: "Instruction",
          modules: {
            toolbar: [
              ["bold", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }
      );
      quillInstructionInstance.current.on("text-change", () => {
        setInstructions(quillInstructionInstance.current.root.innerHTML);
      });
    }

    if (!quillIngredientInstance.current && quillIngredientRef.current) {
      quillIngredientInstance.current = new window.Quill(
        quillIngredientRef.current,
        {
          theme: "snow",
          placeholder: "Ingredients",
          modules: {
            toolbar: [
              ["bold", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }
      );
      quillIngredientInstance.current.on("text-change", () => {
        setIngredients(quillIngredientInstance.current.root.innerHTML);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({ ...recipeData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setVideo(videoFile);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title } = recipeData;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      formData.append("recipeType", category);

      if (file) {
        formData.append("file", file);
      }

      if (video) {
        formData.append("video", video);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/recipes/update-recipe/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userAuth.user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        await swal("Success", "Recipe updated successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        navigate("/contributor-dashboard/available-books");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to update recipe");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
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

            {/* Name Input */}
            <div className="form-group mb-2">
              <label htmlFor="title">Name</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Enter Recipe Name"
                value={recipeData.title}
                onChange={handleChange}
              />
            </div>

            {/* Quill Editor for Ingredients */}
            <div className="form-group mb-2">
              <label>Ingredients</label>
              <div ref={quillIngredientRef}></div>
            </div>

            {/* Quill Editor for Instructions */}
            <div className="form-group mb-2">
              <label>Instructions</label>
              <div ref={quillInstructionRef}></div>
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

            {/* Video Upload */}
            <div className="mb-3">
              <label htmlFor="video-input" className="form-label">
                Upload Video (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="video-input"
                accept="video/*"
                onChange={handleVideoChange}
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
                <option value="">Choose a category</option>
                <option value="dessert">Dessert</option>
                <option value="dietery">Dietary</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Update Recipe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
