import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "lucide-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { auth } from "../../context/AuthContext";
import axios from "axios";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userAuth } = useContext(auth);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/library/all-books`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.token}`,
            },
          }
        );
        setBooks(response.data.allBooks);
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (book) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete this book!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes, delete it!",
          className: "btn btn-success",
        },
        cancel: {
          visible: true,
          className: "btn btn-danger",
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${import.meta.env.VITE_BASE_URL}/library/delete-book/${book._id}`,
            {
              headers: {
                Authorization: `Bearer ${userAuth.token}`,
              },
            }
          )
          .then(() => {
            swal({
              title: "Deleted!",
              text: "The book has been deleted.",
              icon: "success",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            setBooks((prevBooks) =>
              prevBooks.filter((b) => b._id !== book._id)
            );
          })
          .catch((err) => {
            setError(err.response?.data?.message);
          });
      } else {
        swal.close();
      }
    });
  };

  const handleEdit = (book) => {
    navigate(`/admin-dashboard/edit-book/${book._id}`);
  };

  const imageBodyTemplate = (rowData) => (
    <img
      src={rowData.bookPhoto}
      alt="Book Cover"
      style={{
        width: "80px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  );

  const actionsBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        aria-readonly
        className="bg-success px-3 me-1 py-1"
        onClick={() => handleEdit(rowData)}
      >
        <Edit size={18} />
        Update
      </button>

      <button
        aria-readonly
        className="bg-danger px-3 py-1"
        onClick={() => handleDelete(rowData)}
      >
        <DeleteIcon />
        Delete
      </button>
    </div>
  );

  const PdfEmbed = (rowData) => {
    if (!rowData.book) {
      return <span>No Preview Available</span>;
    }
    return (
      <div
        style={{ width: "100px", cursor: "pointer" }}
        onClick={() => window.open(rowData.book, "_blank")}
      >
        <span style={{ color: "blue", textDecoration: "underline" }}>
          View PDF
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6 text-dark">
        All Books
      </h2>
      {/* {error && (
        <Alert
          severity="error"
          style={{ display: "flex", alignItems: "center" }}
        >
          {error}
        </Alert>
      )} */}

      {/* Search Input */}
      <div className="mb-4">
        <InputText
          type="text"
          placeholder="Search..."
          className="p-inputtext-sm w-full"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* PrimeReact DataTable without Pagination */}
      <DataTable
        value={books}
        globalFilter={globalFilter}
        responsiveLayout="scroll"
        emptyMessage="No books found."
        className="p-datatable-striped p-datatable-sm"
        scrollable
        scrollHeight="500px"
      >
        <Column
          header="Image"
          body={imageBodyTemplate}
          style={{ width: "13%" }}
          sortable
        />
        <Column
          header="Preview PDF"
          body={PdfEmbed}
          style={{ width: "13%" }}
          sortable
        />

        {/* <Column
          field="author"
          header="Author"
          sortable
          style={{ width: "11%" }}
        /> */}
        <Column
          field="title"
          header="Title"
          sortable
          style={{ width: "14%" }}
        />
        <Column
          field="genre"
          header="Genre"
          sortable
          style={{ width: "10%" }}
        />
        <Column
          header="Actions"
          body={actionsBodyTemplate}
          sortable
          style={{ width: "25%" }}
        />
      </DataTable>
    </div>
  );
};

export default AllBooks;
