import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tabs, Tab, Container, Row, Col, Card } from "react-bootstrap";

const HomePage = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ["science", "history", "fiction"];

  useEffect(() => {
    if (!categories.includes(category)) {
      navigate("/science", { replace: true });
    }
  }, [category, navigate]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/library/all-books-user`,
          { params: { genre: category } }
        );
        // console.log(response);
        setBooks(response.data.allBooks);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching recipes");
      }
    };

    fetchRecipes();
  }, [category]);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 text-dark">All Books</h2>
      <Tabs
        activeKey={category}
        onSelect={(tab) => navigate(`/${tab}`)}
        className="mb-3"
      >
        {categories.map((cat) => (
          <Tab eventKey={cat} title={cat.toUpperCase()} key={cat}>
            <Row>
              {books.length > 0 ? (
                books.map((book) => (
                  <Col md={4} key={book._id} className="mb-4">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={`${book.bookPhoto}`}
                        alt={book.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title className="text-dark">{book.title}</Card.Title>
                        <Card.Text>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: book.genre.substring(0, 50),
                            }}
                          ></span>
                        </Card.Text>
                        <button
                          className="bg-success px-3 py-1 me-1"
                          onClick={() =>
                            navigate(`/library/all-book-user/${book._id}`)
                          }
                        >
                          View Book
                        </button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center mt-3">No book found.</p>
              )}
            </Row>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default HomePage;
