import { Alert } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const Contact = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState(null);

  // Handle form input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/contact/contact-us`,
        formData
      );

      console.log(response);

      if (response.status === 200) {
        await swal("Success", "Message sent successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        setError(null);
      } else {
        setError(response?.data?.message);
      }
      // Reset the form after submission
      setFormData({ name: "", subject: "", email: "", message: "" });
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row d-flex align-items-start">
        {/* Left Section: Contact Form */}
        <div className="col-md-6">
          <h2 className="mb-4 text-dark">Contact the Library</h2>
          <p className="text-muted">
            Have questions about books, membership, or research assistance? 
            Fill out the form below, and our team will get back to you soon!
          </p>
          <form className="shadow-sm p-4 rounded bg-white">
            {error && <Alert severity="error">{error}</Alert>}
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label text-dark">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label text-dark">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter Subject (e.g., Book Inquiry, Membership)"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label text-dark">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="Write your message here"
              ></textarea>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary btn-lg w-100"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Divider for better separation */}
        <div className="col-md-1 d-none d-md-block">
          <div className="vr h-100"></div>
        </div>

        {/* Right Section: Contact Information */}
        <div className="col-md-5">
          <h3 className="text-dark">Library Contact Details</h3>
          <p className="text-muted">
            You can also reach us directly through the following contact details:
          </p>
          <p>
            <i className="fas fa-envelope me-2 text-dark"></i> librarysupport@example.com
          </p>
          <p>
            <i className="fas fa-phone me-2 text-dark"></i> +1 555 123 4567
          </p>
          <p>
            <i className="fas fa-map-marker-alt me-2 text-dark"></i> 123 Library St, Cityville, USA
          </p>
          <h4 className="mt-4 text-dark">Follow Us</h4>
          <div className="mt-3 d-flex gap-3">
            <a
              href="https://facebook.com"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f fs-4"></i>
            </a>
            <a
              href="https://twitter.com"
              className="text-info"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter fs-4"></i>
            </a>
            <a
              href="https://instagram.com"
              className="text-danger"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram fs-4"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
