import React, { useEffect, useState, useContext } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
import { auth } from "../../context/AuthContext";
import axios from "axios";

const RequestedBooks = () => {
  const [requestedBooks, setRequestedBooks] = useState([]);
  const { userAuth } = useContext(auth);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const fetchRequestedBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/library/requested-books`,
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );
      setRequestedBooks(response.data.requestedBooks);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchRequestedBooks();
  }, []);

  const handleApproval = async (bookId) => {
    try {
      console.log(bookId);
      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/library/handle-borrow-request/${bookId}`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      // console.log(response.data);

      if (response.status === 200) {
        swal({
          title: "Success",
          text: "Book request approved successfully!",
          icon: "success",
          button: "OK",
        });
        fetchRequestedBooks(); // Refresh the list
      }
    } catch (err) {
      swal({
        title: "Error",
        text: err.response?.data?.message,
        icon: "error",
        button: "OK",
      });
    }
  };

  const handleRejection = async (bookId) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/library/handle-borrow-request/${bookId}`,
        { status: "rejected" },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      console.log(response.data);
      if (response.status === 200) {
        swal({
          title: "Success",
          text: "Book request rejected successfully!",
          icon: "success",
          button: "OK",
        });
        fetchRequestedBooks(); // Refresh the list
      }
    } catch (err) {
      swal({
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
        icon: "error",
        button: "OK",
      });
    }
  };

  // Custom template for the book photo column
  const bookPhotoTemplate = (rowData) => {
    return (
      <img
        src={rowData.bookPhoto}
        alt={rowData.title}
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    );
  };

  // Custom template for the action column
  const actionTemplate = (rowData) => {
    return (
      <>
        <button
          className="btn btn-danger px-2 py-1"
          onClick={() => handleApproval(rowData)}
        >
          <KeyboardReturnIcon className="me-1" />
          Approve
        </button>

        <button
          className="btn btn-danger px-2 py-1"
          onClick={() => handleRejection(rowData)}
        >
          <KeyboardReturnIcon className="me-1" />
          Reject
        </button>
      </>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Requested Books</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-inputtext p-component w-full"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <DataTable
        value={requestedBooks}
        globalFilter={globalFilter}
        stripedRows
        responsiveLayout="scroll"
        className="shadow-md rounded-lg"
      >
        <Column
          field="bookPhoto"
          header="Image"
          sortable
          body={bookPhotoTemplate}
          style={{ width: "10%" }}
        />

        <Column
          field="title"
          header="Title"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="author"
          header="Author"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="genre"
          header="Genre"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="requestedBy"
          header="Requested By"
          sortable
          style={{ width: "20%" }}
        ></Column>

        <Column
          field="status"
          header="Status"
          sortable
          style={{ width: "10%" }}
        ></Column>

        {/* <Column
          field="fine"
          header="Fine"
          sortable
          style={{ width: "10%" }}
        ></Column> */}

        {/* <Column
          field="remainingDays"
          header="Remaining Days"
          sortable
          style={{ width: "20%" }}
        ></Column> */}

        {userAuth.role === "admin" && (
          <Column
            // field="remainingDays"
            header="Action"
            body={actionTemplate}
            sortable
            style={{ width: "20%" }}
          ></Column>
        )}
      </DataTable>
    </div>
  );
};

export default RequestedBooks;
