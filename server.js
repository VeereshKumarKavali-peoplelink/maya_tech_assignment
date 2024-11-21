require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
const errorHandler = require("./middleware/errorHandler");


const app = express();
app.use(cors());
app.use(express.json());


app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use(errorHandler);



const port = process.env.PORT || 3005;

const initializeDbAndServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("MongoDB Connected..."));

        app.listen(port, () => {
            console.log(`Server is running at port ${port}`);
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();


