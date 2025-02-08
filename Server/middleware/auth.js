const jwt = require("jsonwebtoken");

const authenticate = (role) => (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send(err.message);
    if (role && user.role !== role)
      return res.status(403).json({ message: "Access Denied" });
    req.user = user;
    next();
  });
};

module.exports = { authenticate };
