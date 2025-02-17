import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5>About Our Library</h5>
            <p>
              Welcome to the Online Library System! Explore thousands of books,
              research papers, and digital archives. Enjoy a seamless borrowing
              experience anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 px-5">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/home" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-white text-decoration-none"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-white text-decoration-none"
                >
                  Contact Us
                </Link>
              </li>
             
              
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 mb-4">
            <h5>Contact Us</h5>
            <p>Need help? Reach out to our library support team.</p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              support@librarysystem.com
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="me-2" />
              +1 555 123 4567
            </p>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
              123 Library St, Cityville, USA
            </p>
            <div className="mt-3">
              <a
                href="https://facebook.com"
                className="text-white me-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} className="fs-4" />
              </a>
              <a
                href="https://twitter.com"
                className="text-white me-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} className="fs-4" />
              </a>
              <a
                href="https://instagram.com"
                className="text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} className="fs-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Online Library System. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
