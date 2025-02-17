import React, { useEffect, useState, useContext } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
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

  // const fetchRequestedBooks = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BASE_URL}/library/requested-books`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userAuth.token}`,
  //         },
  //       }
  //     );

  //     console.log(response.data.requestedBooks);

  //     if (
  //       response.data.requestedBooks.some(
  //         (book) => book.requestStatus === "pending"
  //       )
  //     ) {
  //       const pendingBooks = response.data.requestedBooks.filter(
  //         (book) => book.requestStatus === "pending"
  //       );
  //       // console.log("Pending Books:", pendingBooks);

  //       setRequestedBooks(pendingBooks);
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Something went wrong");
  //   }
  // };

  // useEffect(() => {
  //   fetchRequestedBooks();
  // }, []);

  useEffect(() => {
    fetchRequestedBooks();
  }, []);

  const fetchRequestedBooks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/library/requested-books`,
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      // console.log(response);

      if (userAuth.role === "admin") {
        if (response.data.requestedBooks) {
          const transformedBooks = response.data.requestedBooks.flatMap(
            (book) =>
              book.isRequestedBy.map((requester) => ({
                ...book,
                requesterName: requester.name,
                requesterId: requester._id,
              }))
          );

          setRequestedBooks(transformedBooks);
        }
      } else if (userAuth.role === "user") {
        if (response.data.requestedBooks) {
          // const transformedBooks = response.data.requestedBooks.flatMap(
          //   (book) =>
          //     book.isRequestedBy.map((requester) => ({
          //       ...book,
          //       requesterName: requester.name,
          //       requesterId: requester._id,
          //     }))
          // );

          const transformedBooks = response.data.requestedBooks
            .filter((book) =>
              book.isRequestedBy.some(
                (requester) => requester._id === userAuth.id
              )
            )
            .map((book) => {
              const requester = book.isRequestedBy.find(
                (requester) => requester._id === userAuth.id
              );
              return {
                ...book,
                requesterName: requester.name,
                requesterId: requester._id,
              };
            });
          // console.log(transformedBooks);
          setRequestedBooks(transformedBooks);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("Fetch Error:", err);
    }
  };

  const handleApproval = async (book) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/library/handle-borrow-request/${
          book._id
        }`,
        { status: "approved", userId: book.requesterId },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      if (response.status === 200) {
        await swal({
          title: "Success!",
          text: "Book request approved successfully!",
          icon: "success",
          buttons: false,
          timer: 2000,
        });

        // setRequestedBooks((prevBooks) =>
        //   prevBooks.filter((b) => b._id !== book._id)
        // );

        setRequestedBooks((prevBooks) =>
          prevBooks.filter(
            (b) => !(b._id === book._id && b.requesterId === book.requesterId)
          )
        );

        // fetchRequestedBooks();
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

  const handleRejection = async (book) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/library/handle-borrow-request/${
          book._id
        }`,
        { status: "rejected", userId: book.requesterId },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      // console.log(response.data);

      if (response.status === 200) {
        await swal({
          title: "Success",
          text: "Book request rejected successfully!",
          icon: "success",
          buttons: false,
          timer: 2000,
        });
        setRequestedBooks((prevBooks) =>
          prevBooks.filter(
            (b) => !(b._id === book._id && b.requesterId === book.requesterId)
          )
        );
        // fetchRequestedBooks();
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
          className="btn btn-success px-1 py-1 me-1"
          onClick={() => handleApproval(rowData)}
        >
          <CheckCircleOutlineIcon className="me-1" />
          Approve
        </button>

        <button
          className="btn btn-danger px-1 py-1"
          onClick={() => handleRejection(rowData)}
        >
          <HighlightOffIcon className="me-1" />
          Reject
        </button>
      </>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark">
        Requested Books
      </h2>
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
        emptyMessage="No Requests."
        stripedRows
        responsiveLayout="scroll"
        className="shadow-md rounded-lg"
      >
        <Column
          field="bookPhoto"
          header="Image"
          sortable
          body={bookPhotoTemplate}
          style={{ width: "5%" }}
        />

        {userAuth.role === "user" && (
          <Column
            field="author"
            header="Author"
            sortable
            style={{ width: "10%" }}
          ></Column>
        )}

        <Column
          field="title"
          header="Title"
          sortable
          style={{ width: "10%" }}
        ></Column>

        {userAuth.role === "user" && (
          <Column
            field="isbn"
            header="ISBN"
            sortable
            style={{ width: "10%" }}
          ></Column>
        )}

        {userAuth.role === "admin" && (
          <Column
            field="requesterName"
            header="Requested By"
            sortable
            style={{ width: "15%" }}
          ></Column>
        )}
        {/* <Column
          field="requestStatus"
          header="Status"
          sortable
          style={{ width: "10%" }}
        ></Column> */}

        {userAuth.role === "admin" && (
          <Column
            // field="remainingDays"
            header="Action"
            body={actionTemplate}
            sortable
            style={{ width: "22%" }}
          ></Column>
        )}
      </DataTable>
    </div>
  );
};

export default RequestedBooks;
