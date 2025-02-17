const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");
uuid();
const Library = require("../models/Library");
const User = require("../models/User");

const addBookCtrl = async (req, res) => {
  try {
    const { title, author, isbn, abstract, genre } = req.body;

    const userExist = await User.findOne({ role: "admin" });

    if (userExist.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add books!" });
    }

    if (!title || !author || !isbn || !abstract || !genre) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    if (!req.files || !req.files.pdfFile || !req.files.file) {
      return res
        .status(403)
        .json({ message: "Please choose an image and a book!" });
    }

    const imageFile = req.files.file;
    const pdfFile = req.files.pdfFile;

    // Validate image file
    if (imageFile.size > 150 * 1024) {
      return res
        .status(422)
        .json({ message: "Picture must be less than 150kb!" });
    }

    // Validate PDF file
    if (pdfFile.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed!" });
    }

    if (pdfFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "File must be less than 5MB!" });
    }

    // Upload image
    const imageFileName = `${uuid()}.${imageFile.name.split(".").pop()}`;
    const imageUploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      "bookCover",
      imageFileName
    );
    await imageFile.mv(imageUploadPath);
    const bookImage = `${process.env.Base_Url}/uploads/bookCover/${imageFileName}`;

    // Upload PDF
    const pdfFileName = `${uuid()}.${pdfFile.name.split(".").pop()}`;
    const pdfUploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      "books",
      pdfFileName
    );
    await pdfFile.mv(pdfUploadPath);
    const addBook = `${process.env.Base_Url}/uploads/books/${pdfFileName}`;

    // Create the book entry
    const newBook = await Library.create({
      title,
      author,
      genre,
      isbn,
      book: addBook,
      abstract,
      bookPhoto: bookImage,
    });

    if (!newBook) {
      return res
        .status(403)
        .json({ message: "There was an error adding a book!" });
    }

    return res.status(200).json({ newBook });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const allBooksForUsers = async (req, res) => {
  try {
    const { genre } = req.query; // Get genre from query params

    let query = {}; // Initialize an empty query object

    if (genre) {
      query.genre = genre; // Add genre filter if provided
    }

    let allBooks = await Library.find(query); // Fetch books based on the query

    allBooks = allBooks.map((book) => {
      book.bookPhoto = book.bookPhoto
        ? `${book.bookPhoto}`
        : `${process.env.BASE_URL}/defaultPhoto.jpg`;
      return book;
    });

    return res.status(200).json({ allBooks });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const allBooks = async (req, res) => {
  try {
    const userExist = await User.findOne({ role: "admin" });

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (userExist.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can see all the available books!" });
    }

    let allBooks = await Library.find();

    if (!allBooks || allBooks.length === 0) {
      return res.status(404).json({ message: "No books found!" });
    }

    allBooks = allBooks.map((book) => {
      // If bookPhoto is undefined or null, set a default value
      // console.log(book)
      book.bookPhoto = book.bookPhoto
        ? `${book.bookPhoto}`
        : `${process.env.BASE_URL}/defaultPhoto.jpg`;
      return book;
    });

    return res.status(200).json({ allBooks });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const availableBooksForUser = async (req, res) => {
  try {
    const userExist = await User.findOne({ role: "user" });

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    let allBooks = await Library.find();

    if (!allBooks || allBooks.length === 0) {
      return res.status(404).json({ message: "No books found!" });
    }

    allBooks = allBooks.map((book) => {
      // If bookPhoto is undefined or null, set a default value
      // console.log(book)
      book.bookPhoto = book.bookPhoto
        ? `${book.bookPhoto}`
        : `${process.env.BASE_URL}/defaultPhoto.jpg`;
      return book;
    });

    return res.status(200).json({ allBooks });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    if (userExist.role !== "admin") {
      return res
        .status(404)
        .json({ message: "Only admin can update the book!" });
    }

    const bookFound = await Library.findById(req.params.id);

    // console.log(bookFound)

    if (!bookFound) {
      return res.status(404).json({ message: "Book not found" });
    }

    // console.log(bookFound);

    return res.status(200).json({ bookFound });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBookUserId = async (req, res) => {
  try {
    const bookFound = await Library.findById(req.params.id);

    // console.log(bookFound)

    if (!bookFound) {
      return res.status(404).json({ message: "Book not found" });
    }

    // console.log(bookFound);

    return res.status(200).json({ bookFound });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeBook = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    await Library.findByIdAndDelete(req.params.id, { new: true });

    return res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, genre, abstract, isbn } = req.body;

    const userExist = await User.findById(req.user.id);

    if (!userExist || userExist.role !== "admin") {
      return res.status(403).json({ message: "Only admin can edit!" });
    }

    if (
      !title &&
      !author &&
      !genre &&
      !isbn &&
      !abstract &&
      !req.files &&
      !req.files.pdfFile &&
      !req.files.file
    ) {
      return res.status(422).json({ message: "No field to update!" });
    }

    const updatedData = {};

    if (title) updatedData.title = title;
    if (author) updatedData.author = author;
    if (genre) updatedData.genre = genre;
    if (abstract) updatedData.abstract = abstract;
    if (isbn) updatedData.isbn = isbn;

    // Get the book to update
    const book = await Library.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    // Handling files
    const imageFile = req.files?.file;
    const pdfFile = req.files?.pdfFile;

    // Update image file
    if (imageFile) {
      if (imageFile.size > 150 * 1024) {
        return res
          .status(422)
          .json({ message: "Picture must be less than 150kb!" });
      }

      // Unlink the old image file
      if (book.bookPhoto) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "bookCover",
          path.basename(book.bookPhoto)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Upload new image file
      const imageFileName = `${uuid()}.${imageFile.name.split(".").pop()}`;
      const imageUploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        "bookCover",
        imageFileName
      );
      await imageFile.mv(imageUploadPath);

      updatedData.bookPhoto = `${process.env.Base_Url}/uploads/bookCover/${imageFileName}`;
    }

    // Update PDF file
    if (pdfFile) {
      if (pdfFile.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF files are allowed!" });
      }
      if (pdfFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: "File must be less than 5MB!" });
      }

      // Unlink the old PDF file
      if (book.book) {
        const oldPdfPath = path.join(
          __dirname,
          "..",
          "uploads",
          "books",
          path.basename(book.book)
        );
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
      }

      // Upload new PDF file
      const pdfFileName = `${uuid()}.${pdfFile.name.split(".").pop()}`;
      const pdfUploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        "books",
        pdfFileName
      );
      await pdfFile.mv(pdfUploadPath);

      updatedData.bookFile = `${process.env.Base_Url}/uploads/books/${pdfFileName}`;
    }

    // Update the book document
    const updatedBook = await Library.findByIdAndUpdate(
      req.params.id,
      { ...updatedData },
      { new: true }
    );

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const requestBorrow = async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    // Find the book
    const book = await Library.findById(bookId).populate("isRequestedBy", "id");
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    // Check if the user already requested the book
    if (book.isRequestedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already requested this book" });
    }

    // Add the user's request to the isRequestedBy array
    // book.isRequestedBy.push(userId);
    book.isRequestedBy.push(userId);

    // console.log(book)

    // book.isRequested = true;
    // book.requestDate = new Date();

    await book.save();

    return res.status(200).json({ message: "Borrow request submitted", book });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchRequestedBooks = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }

    let requestedBooks;

    if (userExist.role === "admin") {
      requestedBooks = await Library.find({
        isRequestedBy: { $exists: true, $ne: [] },
      }).populate("isRequestedBy", "id name email");
      // console.log(requestedBooks);
    } else {
      requestedBooks = await Library.find({
        isRequestedBy: { $exists: true, $ne: [] },
      }).populate("isRequestedBy", "id name email");
    }

    return res.status(200).json({ requestedBooks });
  } catch (error) {
    console.error("Error fetching requested books:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const handleBorrowRequest = async (req, res) => {
  try {
    const { bookId } = req.params;
    // console.log(bookId);

    const { status, userId } = req.body;
    // console.log(userId);

    const book = await Library.findById(bookId).populate(
      "isRequestedBy",
      "id name email"
    );
    // console.log(book.isRequestedBy);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iamtaufeeq01@gmail.com",
        pass: process.env.LIBRARY_SECRET_KEY,
      },
    });

    if (!book) {
      return res.status(404).json({ message: "No pending request found" });
    }

    const currentDate = new Date();

    if (status === "approved") {
      const requesterIndex = book.isRequestedBy.findIndex(
        (user) => user.id === userId
      );

      // console.log(status);

      if (requesterIndex !== -1) {
        // Add the requester to `borrowedBy` with borrowing details

        const requester = book.isRequestedBy[requesterIndex];

        const mailOptions = {
          from: "iamtaufeeq01@gmail.com",
          to: requester.email,
          subject: "Approved",
          text: `Your request for the book "${book.title}" has been approved.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        book.borrowedBy.push({
          user: book.isRequestedBy[requesterIndex]._id,
          requestDate: currentDate,
          approvalDate: currentDate,
          dueDate: new Date(currentDate.setDate(currentDate.getDate() + 1)),
          requestStatus: "approved",
        });

        book.isRequestedBy.splice(requesterIndex, 1);
      }
    } else if (status === "rejected") {
      // Reject the request: remove the user from `isRequestedBy`
      book.isRequestedBy = book.isRequestedBy.filter((user) => {
        user.id !== userId;

        const mailOptions = {
          from: "iamtaufeeq01@gmail.com",
          to: `${user.email}`,
          subject: "Rejected",
          text: `Your request for the book ${book.title} has been rejected.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      });
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    // console.log(book);

    await book.save();

    return res.status(200).json({ message: `Request ${status}`, book });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const borrowedBooks = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    if (userExist.role === "admin") {
      const borrowedBooks = await Library.find({
        "borrowedBy.requestStatus": "approved",
      }).populate("borrowedBy.user", "id fine");

      // Flatten book records so that each borrowedBy entry is treated separately
      const borrowedList = borrowedBooks.flatMap((book) =>
        book.borrowedBy
          .filter((borrow) => borrow.requestStatus === "approved") // Only approved borrowings
          .map((borrow) => ({
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            bookPhoto: book.bookPhoto,
            user: borrow.user, // Borrower info
            fine: borrow.fine,
            dueDate: borrow.dueDate,
            approvalDate: borrow.approvalDate,
            returnDate: borrow.returnDate,
          }))
      );

      // console.log(borrowedList);
      return res.status(200).json({ borrowedList });
    } else {
      const filteredList = await Library.find({
        borrowedBy: { $elemMatch: { requestStatus: "approved" } },
      }).populate("borrowedBy.user", "id fine");

      // console.log(filteredList);

      const borrowedList = filteredList.filter((book) => {
        return book.borrowedBy.some((borrower) => {
          // console.log(borrower.user.id);
          // console.log(req.user.id);
          return borrower.user.id.toString() === req.user.id.toString();
        });
      });
      // console.log(borrowedList);

      return res.status(200).json({ borrowedList });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const handleReturn = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const returnBook = await Library.findById(bookId).populate(
      "borrowedBy",
      "id fine"
    );

    // console.log(returnBook);

    if (!returnBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    const userBorrow = returnBook.borrowedBy.find(
      (book) => userId === book.user.toString()
    );

    for (let b of returnBook.borrowedBy) {
      // console.log(b);
      if (b.user._id.toString() === userId && b.fine) {
        return res.status(403).json({
          message: `User has not paid fine yet!`,
        });
      }
    }

    if (userBorrow.user.toString() === userId && userBorrow.fine == 0) {
      returnBook.borrowedBy = returnBook.borrowedBy.filter((book) => {
        if (userId === book.user.toString()) {
          // console.log(book.fine);

          // Modify only the returning user's entry
          book.requestStatus = "pending";
          book.finePaid = false;
          book.dueDate = null;
          book.approvalDate = null;
          book.requestDate = null;
          book.returnDate = null;

          return false; // Exclude this book from the array (removes the returning user)
        }
        return true; // Keep all other borrowed books
      });
    }

    await returnBook.save();

    return res
      .status(200)
      .json({ message: "Book return request submitted", returnBook });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const submitFine = async (req, res) => {
  try {
    // console.log(req.files)
    if (!req.files || !req.files.file) {
      return res.status(403).json({ message: "Please choose an image!" });
    }

    const user = await User.findById(req.user.id);
    // console.log(user);

    const library = await Library.findOne({ "borrowedBy.user": user.id });

    for (let b of library.borrowedBy) {
      // console.log(b);
      // console.log(b.user._id.toString());
      // console.log(b.fine);
      // console.log(user.fine);
      if (b.user._id.toString() === req.user.id && user.fine) {
        if (user.fine) {
          return res
            .status(403)
            .json({ message: "You have already submitted your fine!" });
        }
      }
    }

    const imageFile = req.files.file;
    // console.log(imageFile)

    // Validate image file
    if (imageFile.size > 150 * 1024) {
      return res
        .status(422)
        .json({ message: "Picture must be less than 150kb!" });
    }

    // Upload image
    const imageFileName = `${uuid()}.${imageFile.name.split(".").pop()}`;
    const imageUploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      "fine",
      imageFileName
    );

    await imageFile.mv(imageUploadPath);

    const fine = `${process.env.Base_Url}/uploads/fine/${imageFileName}`;

    const userExist = await User.findByIdAndUpdate(
      req.user.id,
      {
        fine,
      },
      { new: true }
    );

    // console.log(userExist);

    if (!userExist) {
      return res
        .status(400)
        .json({ message: "User has not submitted fine yet!" });
    }

    res.status(200).json({ message: "Fine submitted successfully" });
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleFine = async (req, res) => {
  try {
    const { bookId, fine, userId } = req.body;
    // console.log(userId);

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const userExist = await User.findById(req.user.id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iamtaufeeq01@gmail.com",
        pass: process.env.LIBRARY_SECRET_KEY,
      },
    });

    if (userExist.role === "admin") {
      const borrower = await User.findById(userId);

      const book = await Library.findById(bookId).populate(
        "borrowedBy borrowedBy.user",
        "id fine email"
      );

      // console.log(book);

      for (let b of book.borrowedBy) {
        // console.log(b);
        if (b.user && b.user._id.toString() === userId && b.user.fine) {
          const fineImagePath = b.user.fine.replace(
            /^http:\/\/localhost:3000\//,
            ""
          );
          // console.log(b)

          if (b.user.fine) {
            try {
              const filePath = path.join(__dirname, "..", fineImagePath);
              await fs.promises.unlink(filePath);
              b.fine = 0;
              borrower.fine = "";
              b.user.fine = 0;
              b.finePaid = true;
              await User.findByIdAndUpdate(
                userId,
                {
                  fine: "",
                },
                { new: true }
              );

              const mailOptions = {
                from: "iamtaufeeq01@gmail.com",
                to: `${b.user.email}`,
                subject: "Fine Received",
                text: `Your fine for book the ${book.title} has been received. Kindly return book the book as soon as possible. `,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log("Error:", error);
                } else {
                  console.log("Email sent:", info.response);
                }
              });

              await book.save();
            } catch (error) {
              console.error("Error deleting fine image:", error);
            }
          }
        }
      }

      for (let b of book.borrowedBy) {
        if (b.user._id.toString() === userId && b.fine) {
          return res.status(403).json({
            message: `User having id  ${b.user._id} has not paid fine yet!`,
          });
        }
      }

      return res
        .status(200)
        .json({ message: "Fine updated successfully", book });
    } else {
      const book = await Library.findById(bookId).populate(
        "borrowedBy borrowedBy.user",
        "id fine email"
      );

      // console.log(fine);

      let cleanFine = Array.isArray(fine) ? fine[0] : fine;
      // console.log(cleanFine)
      cleanFine = cleanFine.toString().replace(",", ".").trim();
      // console.log(cleanFine)

      for (let b of book.borrowedBy) {
        if (b.user && b.user._id.toString()) {
          // const previousFine = Number(b.fine) || 0;
          // const newFine = Number(fine) || 0;

          // console.log(b);
          if (fine) {
            const parsedFine = Number(cleanFine);
            if (isNaN(parsedFine)) {
              return res.status(400).json({ message: "Invalid fine value" });
            }
            b.fine = parsedFine;
            // const mailOptions = {
            //   from: "iamtaufeeq01@gmail.com",
            //   to: `${b.user.email}`,
            //   subject: "Fine",
            //   text: `You have been fined RS.${fine} for not returning the borrowed book. `,
            // };

            // transporter.sendMail(mailOptions, (error, info) => {
            //   if (error) {
            //     console.log("Error:", error);
            //   } else {
            //     console.log("Email sent:", info.response);
            //   }
            // });
          }
        }
      }

      await book.save();
      // console.log(book);
    }
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptFine = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    // console.log(userId.toString());

    const userExist = await User.findById(req.user.id);
    // console.log(userExist.id);

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (userExist.fine == 0 || userExist.fine == null) {
      return res.status(422).json({ message: "You  have not paid fine yet!" });
    }

    if (userExist.fine < 0 || userExist.fine == null) {
      return res.status(422).json({ message: "You do not have any fine!" });
    }

    const library = await Library.findById(bookId).populate(
      "borrowedby",
      "id fine"
    );

    // console.log(library);

    // if (userExist.id == library.recipientId.id) {
    //   if (userExist.fine) {
    //     // Update user's fine record
    //     library.fine = 0;
    //     userExist.fine = 0;
    //     await userExist.save();
    //     await library.save();
    //     console.log(library);
    //   }
    // }

    res.status(200).json({ message: "Fine submitted successfully" });
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addBookCtrl,
  allBooksForUsers,
  allBooks,
  availableBooksForUser,
  removeBook,
  updateBook,
  getBookById,
  getBookUserId,
  requestBorrow,
  fetchRequestedBooks,
  handleBorrowRequest,
  borrowedBooks,
  handleFine,
  submitFine,
  acceptFine,
  handleReturn,
};
