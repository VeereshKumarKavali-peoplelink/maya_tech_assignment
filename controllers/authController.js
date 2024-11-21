const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validatePassword = (password) => {
    return password.length > 5;
};


exports.register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        if (name && email && password && age) {
            const existingUser = await User.findOne({ email });
            console.log(existingUser);
            if (!existingUser) {
                if (validatePassword(password)) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = new User({ name, email, password: hashedPassword, age });
                    await newUser.save();
                    res.status(200).send({ message: "User created successfully" });
                } else {
                    res.status(400).send({ error: "Password is too short" });
                }
            } else {
                res.status(400).send({ error: "User already exists" });
            }
        } else {
            res.status(400).send({ error: "BAD Request" });
        }
    } catch (err) {
        console.log("Error:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
};




exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.findOne({ email });
            if (!user || user.isDeleted) {
                return res.status(404).json({ error: "Invalid email" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Password" });
            }
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ token });
        } else {
            res.status(400).send({ error: "BAD Request" });
        }
    } catch (err) {
        console.log("Error:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
};
