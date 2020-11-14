const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ err: "Access denied. No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ err: "Invalid token" });
  }
}

module.exports = auth;