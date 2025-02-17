import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ViewBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/library/all-book-user/${id}`
        );

        setBook(response.data.bookFound);
      } catch (err) {
        setError(err?.response?.data?.message);
      }
    };

    fetchBookData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-5 m-auto">
          <div className="card shadow-lg p-4">
            {/* Book Image */}
            <div className="text-center">
              <img
                src={book.bookPhoto}
                alt={book.title}
                className="img-fluid rounded"
                style={{
                  maxHeight: "250px",
                  objectFit: "cover",
                }}
              />
            </div>

            <hr className="" />

            {/* Book Details */}
            <div className="">
              <h3 className="text-dark">{book.title}</h3>

              <hr />

              <h4 className=" text-dark">Genre</h4>
              <p className="text-muted">{book.genre}</p>

              <hr />

              <h4 className=" text-dark">Abstract</h4>
              <div
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: book.abstract }}
              ></div>
            </div>

            <hr className="my-4" />

            {/* Back Button */}
            <div className="text-center mt-3">
              <Link
                className="btn btn-primary px-5 py-2 shadow"
                to={`/${book.genre}`}
              >
                Back to Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
