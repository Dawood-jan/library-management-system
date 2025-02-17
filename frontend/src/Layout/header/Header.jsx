import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  const location = useLocation();
  const isHomeActive = ["/science", "/history", "/fiction"].includes(
    location.pathname
  );

  return (
    <>
      <nav className="navbar bg-primary navbar-expand-lg bg-body-tertiary">
        <div className="container ">
          <Link to="/isHomeActive">
            <img
              src={logo}
              alt="logo"
              className="navbar-brand"
              style={{
                objectFit: "cover",
                margin: "0",
                padding: "0",
                bottom: "4px",
                position: "relative",
              }}
              height="50"
              width={50}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse " id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink
                  to="/dessert"
                  className={({ isActive }) =>
                    isHomeActive || isActive ? "nav-link active" : "nav-link"
                  }
                  style={({ isActive }) =>
                    isHomeActive || isActive
                      ? { background: "rgba(255, 255, 255, 0.22)" }
                      : {}
                  }
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/about-us"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  style={({ isActive }) =>
                    isActive ? { background: "rgba(255, 255, 255, 0.22)" } : {}
                  }
                  aria-current="page"
                >
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/contact-us"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  style={({ isActive }) =>
                    isActive ? { background: "rgba(255, 255, 255, 0.22)" } : {}
                  }
                  aria-current="page"
                >
                  Contact Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  style={({ isActive }) =>
                    isActive ? { background: "rgba(255, 255, 255, 0.22)" } : {}
                  }
                  aria-current="page"
                >
                  Signup
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  style={({ isActive }) =>
                    isActive ? { background: "rgba(255, 255, 255, 0.22)" } : {}
                  }
                >
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
