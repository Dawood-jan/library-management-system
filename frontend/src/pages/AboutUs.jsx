import React from "react";

const AboutLibrary = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section: Image */}
        <div className="col-lg-6 col-md-12 mb-4">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D"
            alt="About Library"
            className="img-fluid rounded shadow"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>

        {/* Right Section: Text */}
        <div className="col-lg-6 col-md-12">
          <h2 className="mb-4 text-center text-md-start">About Our Library</h2>
          <p className="lead text-muted text-center text-md-start">
            Welcome to our Library, a haven for knowledge seekers and book
            lovers. Our mission is to provide a diverse collection of books,
            journals, and digital resources that inspire learning and
            creativity.
          </p>
          <p className="text-center text-md-start">
            Whether you're a student, researcher, or avid reader, our library
            offers a vast selection of materials to enrich your knowledge. Enjoy
            a quiet reading space, participate in literary events, and explore a
            world of ideas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutLibrary;
