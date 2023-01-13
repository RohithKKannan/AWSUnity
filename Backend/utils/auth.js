const jwt = require("jsonwebtoken");

function generateToken(userinfo) {
  if (!userinfo) {
    return null;
  }

  // JWT_SECRET is the environment variable to be setup in AWS lambda
  return jwt.sign(userinfo, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

function verifyToken(username, token) {
  return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
    if (error) {
      return {
        verified: false,
        message: "Invalid token",
      };
    }

    if (response.username !== username) {
      return {
        verified: false,
        message: "Invalid user",
      };
    }

    return {
      verified: true,
      message: "Verified",
    };
  });
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
