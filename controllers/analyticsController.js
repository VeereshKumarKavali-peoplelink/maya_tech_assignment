const User = require("../models/user.js");

exports.ageDistribution = async (req, res) => {
  try {
    const distribution = await User.aggregate([
      { $match: { isDeleted: false } },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 20, 30, Infinity],
          default: "Other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);
    res.status(200).json({data: distribution});
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.activeUsers = async (req, res) => {
  try {
    const [activeCount, inactiveCount] = await Promise.all([
        User.countDocuments({ isActive: true, isDeleted: false }),
        User.countDocuments({ isActive: false, isDeleted: false }),
      ]);
    res.status(200).json({ active: activeCount, inactive: inactiveCount });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
