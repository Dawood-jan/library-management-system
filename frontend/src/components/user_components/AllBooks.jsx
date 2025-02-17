import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { auth } from "../../context/AuthContext";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const { userAuth } = useContext(auth);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/library/availabe-books`
        );
        setBooks(response.data.allBooks);
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message);
      }
    };
    fetchBooks();
  }, []);

  const handleView = (book) => {
    setShowModal(book);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  const imageBodyTemplate = (rowData) => {
    return rowData.bookPhoto ? (
      <img
        src={rowData.bookPhoto}
        alt="book_photo"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    ) : (
      <span className="text-muted">No Image Available</span>
    );
  };

  const handleRequest = async (book) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/library/request-borrow`,
        { bookId: book._id, userId: userAuth.id },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );
      // setBooks((prevBooks) =>
      //   prevBooks.map((b) =>
      //     b._id === book._id ? { ...b, isRequested: true } : b
      //   )
      // );

      if (response.status === 200) {
        swal({
          title: "Success!",
          text: "Your request has been sent to the admin for approval.!",
          icon: "success",
          buttons: false,
          timer: 2000,
        });

        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b._id === book._id
              ? {
                  ...b,
                  isRequestedBy: [...(b.isRequestedBy || []), userAuth.id],
                }
              : b
          )
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Request Failed!",
        text: error.response?.data?.message || "An error occurred.",
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
  };

  // const actionBodyTemplate = (rowData) => {
  //   return (
  //     <div className="d-flex gap-2">
  //       {console.log(rowData)}
  //       {!rowData.isRequestedBy?.includes(userAuth.id) &&
  //       !rowData.borrowedBy?.some((borrow) => borrow.user === userAuth.id) ? (
  //         <button
  //           disabled={
  //             rowData.requestStatus === "approved" && userId === userAuth.id
  //           }
  //           className={`btn ${
  //             rowData.requestStatus === "approved" && userId === userAuth.id
  //               ? "btn-primary"
  //               : "btn-success"
  //           }`}
  //           onClick={() => handleRequest(rowData)}
  //         >
  //           {rowData.requestStatus === "approved" &&
  //           rowData.userId === userAuth.id
  //             ? "Borrowed"
  //             : "Request"}{" "}
  //         </button>
  //       ) : null}

  //       <button
  //         className="btn btn-primary px-1 py-1"
  //         onClick={() => handleView(rowData)}
  //       >
  //         <VisibilityIcon className="me-1" /> View
  //       </button>
  //     </div>
  //   );
  // };

  const actionBodyTemplate = (rowData) => {
    const hasRequested = rowData.isRequestedBy?.includes(userAuth.id);
    const hasBorrowed = rowData.borrowedBy?.some(
      (borrow) => borrow.user === userAuth.id
    );

    return (
      <div className="d-flex gap-2">
        {!hasRequested && !hasBorrowed ? (
          <button
            className="btn btn-success"
            onClick={() => handleRequest(rowData)}
          >
            Request
          </button>
        ) : null}

        <button
          className="btn btn-primary px-1 py-1"
          onClick={() => handleView(rowData)}
        >
          <VisibilityIcon className="me-1" /> View
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">All Books</h2>
      {/* {error && <Alert severity="error">{error}</Alert>} */}

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded "
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <DataTable
        value={books}
        emptyMessage="No books found!"
        rows={10}
        globalFilter={globalFilter}
        className="p-datatable-striped"
        responsiveLayout="scroll"
      >
        <Column
          field="bookPhoto"
          header="Image"
          body={imageBodyTemplate}
          sortable
        />
        <Column field="author" header="Author" sortable />
        <Column field="title" header="Title" sortable />
        <Column field="genre" header="Genre" sortable />
        <Column header="Action" body={actionBodyTemplate} />
      </DataTable>

      {showModal && (
        <div
          className="modal show d-flex justify-content-center align-items-center"
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{ maxWidth: "50%", minWidth: "600px" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{showModal.title}</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {showModal.bookPhoto && (
                  <img
                    src={showModal.bookPhoto}
                    className="mb-3"
                    style={{ maxWidth: "100%" }}
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: showModal.abstract }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBooks;
