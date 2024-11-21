const express = require("express");
const { createUser, getUsers, updateUser, deleteUser, getSoftDeletedUsers } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const validateUser = require("../middleware/globalValidateUser.js");

const router = express.Router();

// Public APIs
router.post("/", authenticate, validateUser, createUser);
router.get("/", authenticate, getUsers);
router.put("/:id", authenticate, updateUser);

// Restricted APIs for Admins only
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);
router.get("/soft-deleted", authenticate, authorize(["admin"], getSoftDeletedUsers));

module.exports = router;
