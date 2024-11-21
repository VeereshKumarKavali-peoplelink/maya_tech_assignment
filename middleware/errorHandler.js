const errorHandler = (err, req, res, next) => {
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation Error", details: errors });
    }
  
    // Handle duplicate key error (e.g., unique email constraint)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue).join(", ");
      return res.status(400).json({ error: `Duplicate value for field: ${field}` });
    }

    // Handle other errors
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  };
  
  module.exports = errorHandler;
  