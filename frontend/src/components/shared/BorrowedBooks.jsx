import React, { useEffect, useState, useContext } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
// import { Document, Page, pdfjs  } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { auth } from "../../context/AuthContext";
import axios from "axios";

const BorrowedBook = () => {
  const [books, setBooks] = useState([]);
  const { userAuth } = useContext(auth);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState(null);

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

        // console.log(response);

        // if (userAuth.role === "admin") {
        //   const currentDate = new Date();
        //   const booksWithRemainingDays = response.data.borrowedList.map(
        //     (book) => {
        //       if (!book.dueDate) return book; // Skip if no due date

        //       const dueDate = new Date(book.dueDate);
        //       const difference = dueDate - currentDate;
        //       const remainingDays = Math.floor(
        //         difference / (1000 * 60 * 60 * 24)
        //       );
        //       const fine = remainingDays < 0 ? Math.abs(remainingDays) * 10 : 0;

        //       return {
        //         ...book,
        //         remainingDays,
        //         fine: book.finePaid ? 0 : fine, // Apply fine only if not paid
        //       };
        //     }
        //   );

        //   setBooks(booksWithRemainingDays);
        // } else {
        //   const booksWithRemainingDays = response.data.borrowedList.map(
        //     (book) => {
        //       // console.log(book);
        //       const currentDate = new Date();
        //       let dueDate;
        //       let difference;
        //       let remainingDays;
        //       let fine;

        //       book.borrowedBy.map((borower) => {
        //         console.log(borower);
        //         if (borower.finePaid) {
        //           borower.fine = 0;
        //         } else {
        //           dueDate = new Date(borower.dueDate);
        //           difference = dueDate - currentDate;
        //           remainingDays = Math.floor(
        //             difference / (1000 * 60 * 60 * 24)
        //           );
        //           fine = remainingDays <= 0 ? Math.abs(remainingDays) * 10 : 0;
        //           if (remainingDays <= 0 && fine > 0) {
        //             borower.fine = fine;
        //             updateBookFine(book);
        //           } else if (fine === 0) {
        //             borower.fine = fine;
        //             updateBookFine(book);
        //           }
        //         }
        //       });

        //       // console.log(bookWithFine);

        //       return { ...book, remainingDays, fine };
        //     }
        //   );
        //   setBooks(booksWithRemainingDays);
        // }

        if (userAuth.role === "admin") {
          const currentDate = new Date();
          const booksWithRemainingDays = response.data.borrowedList.map(
            (book) => {
              if (!book.dueDate) return book; // Skip if no due date

              const dueDate = new Date(book.dueDate);
              const difference = dueDate - currentDate;
              const remainingDays = Math.floor(
                difference / (1000 * 60 * 60 * 24)
              );
              const fine = remainingDays < 0 ? Math.abs(remainingDays) * 10 : 0;

              return {
                ...book,
                remainingDays,
                fine: book.finePaid ? 0 : fine, // Apply fine only if not paid
              };
            }
          );

          setBooks(booksWithRemainingDays);
        } else {
          const currentDate = new Date();

          const booksWithRemainingDays = response.data.borrowedList.flatMap(
            (book) => {
              // Filter books to only include those borrowed by the current user
              const userBorrowRecords = book.borrowedBy.filter(
                (borrower) => borrower.user._id === userAuth.id
              );

              // console.log()

              return userBorrowRecords.map((borrower) => {
                let remainingDays = 0;
                let fine = 0;

                if (borrower.dueDate) {
                  const dueDate = new Date(borrower.dueDate);
                  const difference = dueDate - currentDate;
                  remainingDays = Math.floor(
                    difference / (1000 * 60 * 60 * 24)
                  );
                  fine = remainingDays < 0 ? Math.abs(remainingDays) * 10 : 0;
                }

                if (!borrower.finePaid) {
                  console.log(borrower);
                  borrower.fine = fine;
                  updateBookFine(book);
                } else {
                  remainingDays = null;
                  fine = null;
                }

                return { ...book, remainingDays, fine };
              });
            }
          );

          setBooks(booksWithRemainingDays);
        }
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message);
      }
    };

    fetchBooks();
  }, []);

  const updateBookFine = async (book) => {
    try {
      const fine = book.borrowedBy.map((b) => {
        return b.fine;
      });
      // console.log(fine)

      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/library/update-fine`,
        {
          bookId: book._id,
          fine,
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating fine:", error);
    }
  };

  const handleReturn = async (book) => {
    try {
      // console.log(book);
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/library/return-books`,
        { bookId: book._id },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        swal({
          title: "Book returned!",
          text: "Your have the book successfully!",
          icon: "success",
          buttons: false,
          timer: 2000,
        });
        setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Return Failed!",
        text: error.response?.data?.message || "An error occurred.",
        icon: "error",
        buttons: false,
        timer: 2000,
      });
    }
  };

  const submitFine = async (book) => {
    try {
      const userId = book.borrowedBy.map((b) => {
        return b.user._id;
      });

      // console.log(userId);

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/library/accept-fine`,
        {
          bookId: book._id,
          userId,
          // fine: book.recipientId.fine, // Send the calculated fine
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        }
      );

      // console.log(response);

      if (response.status === 200) {
        swal({
          title: "Fine Accepted!",
          text: "Fine has been accepted successfully!",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setBooks((prevBooks) => prevBooks.filter((b) => b._id !== books._id));
      }
    } catch (error) {
      swal({
        title: "Fine Failed!",
        text: error.response?.data?.message || "An error occurred.",
        icon: "error",
        buttons: false,
        timer: 3000,
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

  const actionTemplate = (rowData) => {
    return (
      <>
        {/* {rowData.fine > 0 && (
          <button
            className="btn btn-danger px-2 py-1"
            onClick={() => submitFine(rowData)}
          >
            <KeyboardReturnIcon className="me-1" />
            Pay Fine
          </button>
        )} */}

        <button
          className="btn btn-danger px-2 py-1"
          onClick={() => handleReturn(rowData)}
        >
          <KeyboardReturnIcon className="me-1" />
          Return
        </button>
      </>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark">
        Borrowed Books
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
        emptyMessage="No Borrowed Books."
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

        {/* <Column header="Preview PDF" body={PdfEmbed} /> */}
        {userAuth.role === "user" && (
          <Column
            header="Preview PDF"
            body={PdfEmbed}
            style={{ width: "10%" }}
            sortable
          />
        )}

        {userAuth.role === "admin" && (
          <Column
            field="title"
            header="Title"
            sortable
            style={{ width: "10%" }}
          ></Column>
        )}

        {/* {userAuth.role === "user" && (
          <Column
            field="author"
            header="Author"
            sortable
            style={{ width: "10%" }}
          ></Column>
        )} */}

        <Column
          field="fine"
          header="Fine"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="remainingDays"
          header="Remaining Days"
          sortable
          style={{ width: "20%" }}
        ></Column>

        {userAuth.role === "user" && (
          <Column
            // field="remainingDays"
            header="Action"
            body={actionTemplate}
            sortable
            style={{ width: "15%" }}
          ></Column>
        )}
      </DataTable>
    </div>
  );
};

export default BorrowedBook;
