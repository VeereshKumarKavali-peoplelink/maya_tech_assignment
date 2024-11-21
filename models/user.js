const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: true, unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format",
        },
    },
    password: { type: String, required: true },
    age: {
        type: Number, 
        min: [1, "Age must be a positive number"],
        max: [120, "Age seems unrealistic"],
    },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model(process.env.userTable, userSchema);
