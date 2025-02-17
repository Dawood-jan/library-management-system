import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { LogOut } from "lucide-react";
import { BsPencilSquare } from "react-icons/bs";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Profile from "../../components/shared/Profile";
import UpdateProfile from "../../components/shared/UpdateProfile";
import { auth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import AllBooks from "../../components/user_components/AllBooks";
import EditRecipe from "../../components/user_components/EditRecipe";
import { Alert, Avatar } from "@mui/material";
import BorrowedBooks from "../../components/shared/BorrowedBooks";
import { SwapHoriz } from "@mui/icons-material";
import ResetFine from "../../components/user_components/ResetFine";
import RequestedBooks from "../../components/admin_components/RequestedBooks";

const UserDashboard = () => {
  const { logout, getprofilePhoto, profileImage } = useContext(auth);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const location = useLocation();

  const userAuth = JSON.parse(localStorage.getItem("userAuth"));
  // console.log(userAuth.user.updatedUser);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const res = await profileImage(file);
      if (res.success) {
        // console.log(res);
        const fullPhotoUrl = `${import.meta.env.VITE_BASE_URL}/${
          res.payload.photoUrl
        }`;

        // console.log(fullPhotoUrl);

        setProfilePic(fullPhotoUrl);
        closeModal();
      } else {
        console.log(res);
        setError(res?.message);
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error.message);
      // setError(res?.message);
      // alert("Failed to upload profile photo.");
    }
  };

  useEffect(() => {
    const getprofilePic = async () => {
      try {
        const res = await getprofilePhoto();
        if (!res.success) {
          console.log(res?.message);
        } else {
          // console.log(res.payload.photoUrl);
          // const fullPhotoUrl = `${import.meta.env.VITE_BASE_URL}/${
          //   res.payload.photoUrl
          // }`;

          // console.log(res.payload.photoUrl);
          setProfilePic(res.payload);
        }
      } catch (error) {
        console.log(error?.message);
      }
    };
    getprofilePic();
  }, [profilePic]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="wrapper">
      {/* <!-- Sidebar --> */}
      <div class="sidebar" data-background-color="dark">
        <div class="sidebar-logo">
          {/* <!-- Logo Header --> */}
          <div class="logo-header" data-background-color="dark">
            <Link to="/user-dashboard/all-books" className="logo">
              <img
                src={logo}
                alt="navbar brand"
                class="navbar-brand"
                height="60"
                width={60}
              />
            </Link>
            <div class="nav-toggle">
              <button class="btn btn-toggle toggle-sidebar">
                <i class="gg-menu-right"></i>
              </button>
              <button class="btn btn-toggle sidenav-toggler">
                <i class="gg-menu-left"></i>
              </button>
            </div>
            <button class="topbar-toggler more">
              <i class="gg-more-vertical-alt"></i>
            </button>
          </div>
          {/* <!-- End Logo Header --> */}
        </div>
        <div class="sidebar-wrapper scrollbar scrollbar-inner">
          <div class="sidebar-content">
            <ul class="nav nav-secondary">
              <li
                className={`nav-item ${
                  location.pathname === "/user-dashboard/all-books"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/user-dashboard/all-books">
                  <FormatListBulletedIcon
                    style={{
                      color:
                        location.pathname === "/user-dashboard/all-books"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  All Books
                </Link>
              </li>

              <li
                className={`nav-item ${
                  location.pathname === "/user-dashboard/requested-books-list"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/user-dashboard/requested-books-list">
                  <MailOutlineIcon
                    style={{
                      color:
                        location.pathname ===
                        "/user-dashboard/requested-books-list"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  Requested Books
                </Link>
              </li>

              <li
                className={`nav-item ${
                  location.pathname === "/user-dashboard/borrowed-list"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/user-dashboard/borrowed-list">
                  <SwapHoriz
                    style={{
                      color:
                        location.pathname === "/user-dashboard/borrowed-list"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  Borrowed Books
                </Link>
              </li>

              <li
                className={`nav-item ${
                  location.pathname === "/user-dashboard/submit-fine"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/user-dashboard/submit-fine">
                  <KeyboardReturnIcon
                    style={{
                      color:
                        location.pathname === "/user-dashboard/submit-fine"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  Fine
                </Link>
              </li>

              <li class="nav-item">
                <Link onClick={handleLogout}>
                  <LogOut
                    style={{
                      marginRight: "15px",
                    }}
                  />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- End Sidebar --> */}

      <div class="main-panel">
        <div class="main-header">
          <div class="main-header-logo">
            {/* <!-- Logo Header --> */}
            <div class="logo-header" data-background-color="dark">
              <Link to="/user-dashboard/all-books" className="logo">
                <img
                  src={logo}
                  alt="navbar brand"
                  class="navbar-brand"
                  height="60"
                  width={60}
                />
              </Link>
              <div class="nav-toggle">
                <button class="btn btn-toggle toggle-sidebar">
                  <i class="gg-menu-right"></i>
                </button>
                <button class="btn btn-toggle sidenav-toggler">
                  <i class="gg-menu-left"></i>
                </button>
              </div>
              <button class="topbar-toggler more">
                <i class="gg-more-vertical-alt"></i>
              </button>
            </div>
            {/* <!-- End Logo Header --> */}
          </div>
          {/* <!-- Navbar Header --> */}
          <nav class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
            <div class="container-fluid">
              <ul class="navbar-nav topbar-nav ms-md-auto align-items-center">
                <li class="nav-item topbar-icon dropdown hidden-caret"></li>

                <li class="nav-item topbar-user dropdown hidden-caret">
                  <a
                    class="dropdown-toggle profile-pic"
                    data-bs-toggle="dropdown"
                    href="#"
                    aria-expanded="false"
                  >
                    <div class="avatar-sm">
                      {profilePic ? (
                        <Avatar
                          src={profilePic}
                          sx={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      ) : (
                        <Avatar
                          alt="Square Avatar"
                          sx={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      )}
                    </div>
                    <span class="profile-username">
                      <span class="op-7">Hi, </span>
                      <span class="fw-bold">
                        {userAuth?.user ? userAuth.user?.name : userAuth?.name}
                      </span>
                    </span>
                  </a>
                  <ul class="dropdown-menu dropdown-user animated fadeIn">
                    <div class="dropdown-user-scroll scrollbar-outer">
                      <li>
                        <div class="user-box">
                          <div class="avatar-lg position-relative">
                            {profilePic ? (
                              <Avatar
                                src={profilePic}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "10px",
                                  marginTop: "5px",
                                }}
                              />
                            ) : (
                              <Avatar
                                alt="Square Avatar"
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "10px",
                                  marginTop: "5px",
                                }}
                              />
                            )}

                            <button onClick={openModal}>
                              <BsPencilSquare
                                style={{
                                  position: "absolute",
                                  right: "-2",
                                  bottom: "-5",
                                }}
                              />
                            </button>
                          </div>
                          <div className="u-text">
                            <h4>
                              {userAuth?.user
                                ? userAuth.user?.name
                                : userAuth?.name}
                            </h4>
                            <p className="text-muted">
                              {userAuth?.user
                                ? userAuth?.user?.email
                                : userAuth?.email}
                            </p>
                            <Link
                              to="/user-dashboard/user-profile"
                              className="btn btn-xs btn-secondary btn-sm"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-divider"></div>
                        <Link className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </Link>
                      </li>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
          {/* <!-- End Navbar --> */}
        </div>

        <div class="container">
          <div class="page-inner" style={{ backgroundColor: "#F5F7FD" }}>
            <Routes>
              <Route path="/" element={<Navigate to="all-books" />} />
              <Route path="all-books" element={<AllBooks />} />
              <Route path="requested-books-list" element={<RequestedBooks />} />
              <Route path="borrowed-list" element={<BorrowedBooks />} />
              <Route path="submit-fine" element={<ResetFine />} />
              <Route path="/users-recipes/:id" element={<EditRecipe />} />
              <Route path="/user-profile" element={<Profile />} />
              <Route path="/update-user" element={<UpdateProfile />} />
            </Routes>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block align-items-center">
          <div className="modal-dialog">
            <div className="modal-content">
              {error && (
                <Alert
                  severity="error"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {error}
                </Alert>
              )}
              <div className="modal-header">
                <h5 className="modal-title">Upload file</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpload}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
