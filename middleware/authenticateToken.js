const jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    req.admin = jwt.verify(token, process.env.ACCES_TOKEN);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
