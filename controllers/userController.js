const User = require("../models/user.js");

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;
    if (name && email && password && age && role){
        const newUser = new User({ name, email, password, age, role });
        await newUser.save();
        res.status(200).json({ message: "User created successfully", data: newUser });
    }else{
        res.status(400).send({ error: "BAD Request" });
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search=""} = req.query;
    const filter = { isDeleted: false };
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json({data: users});
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({data: user});
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};



//only Admin to get soft-deleted users
exports.getSoftDeletedUsers = async (req, res) => {
  try {
    const userRole = req.user.role;  
    if (userRole !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const softDeletedUsers = await User.find({ isDeleted: true });
    res.status(200).json({ data: softDeletedUsers });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
