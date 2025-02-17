import React, { useEffect, useState, useContext } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
import { auth } from "../../context/AuthContext";
import axios from "axios";

const PaidFine = () => {
  const [books, setBooks] = useState([]);
  const { userAuth } = useContext(auth);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState(null);

  // useEffect(() => {
  //   const fetchBooks = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_BASE_URL}/library/borrowed-books`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${userAuth.token}`,
  //           },
  //         }
  //       );

  //       // console.log(response);

  //       const borrowedList = response.data.borrowedList;

  //       borrowedList.flatMap((book) => {
  //         console.log(book);
  //       });

  //       const booksWithFine = borrowedList
  //         .filter((book) => book.user && book.fine !== 0) // Ensure user exists and fine is not zero
  //         .map((book) => ({
  //           _id: book._id, // Keep book ID
  //           bookPhoto: book.bookPhoto,
  //           title: book.title,
  //           userId: book.user._id, // Extract User ID
  //           fine: book.user.fine, // Extract Fine Amount
  //         }));

  //       setBooks(booksWithFine);
  //     } catch (error) {
  //       console.error(error);
  //       setError(error?.response?.data?.message);
  //     }
  //   };

  //   fetchBooks();
  // }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/library/borrowed-books`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.token}`,
            },
          }
        );

        console.log(response);

        const borrowedList = response.data.borrowedList;

        const booksWithFine = borrowedList.flatMap((book) => {
          if (book.user && book.user.fine !== "") {
            return [
              {
                _id: book._id,
                bookPhoto: book.bookPhoto,
                title: book.title,
                userId: book.user._id,
                fine: book.user.fine,
              },
            ];
          }
          return [];
        });

        setBooks(booksWithFine);
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message);
      }
    };

    fetchBooks();
  }, []);

  const updateBookFine = async (book) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/library/update-fine`,
        {
          bookId: book._id,
          fine: book.fine,
          userId: book.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      // console.log(response);

      if (response.status === 200) {
        await swal({
          title: "Success",
          text: "Fine rested successfully!",
          icon: "success",
          button: "OK",
        });

        // setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
        setBooks((prevBooks) =>
          prevBooks.filter(
            (b) => !(b._id === book._id && b.userId === book.userId)
          )
        );
      }
    } catch (error) {
      console.error("Error updating fine:", error);
      swal({
        title: "Error",
        text: error.response?.data?.message,
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

  const fineImageTemplate = (rowData) => {
    return (
      <img
        src={rowData.fine} // Assuming fine contains the image URL
        alt="0"
        style={{
          width: "70px",
          height: "70px",
          objectFit: "cover",
          borderRadius: "5px",
        }}
      />
    );
  };

  // Custom template for the action column
  const actionTemplate = (rowData) => {
    return (
      <>
        {userAuth.role === "admin" && (
          <button
            className="btn btn-danger px-2 py-1"
            onClick={() => updateBookFine(rowData)}
          >
            <KeyboardReturnIcon className="me-1" />
            Reset Fine
          </button>
        )}
      </>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark">
        Submitted Fine
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
        value={books}
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
          field="userId"
          header="Id"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="title"
          header="Title"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="fine"
          header="Fine Receipt"
          body={fineImageTemplate}
          style={{ width: "15%" }}
        />

        {userAuth.role === "admin" && (
          <Column
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

export default PaidFine;
