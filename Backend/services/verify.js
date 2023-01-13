const util = require("../utils/util");
const auth = require("../utils/auth");

function verify(requestbody) {
  if (!requestbody.user || !requestbody.user.username || !requestbody.token) {
    return util.buildResponse(401, {
      verified: false,
      message: "Incorrect request body",
    });
  }

  const user = requestbody.user;
  const token = requestbody.token;
  const verifyToken = auth.verifyToken(user.username, token);
  if (!verifyToken.verified) {
    return util.buildResponse(401, verifyToken);
  }

  return util.buildResponse(200, {
    verified: true,
    message: "success",
    user: user,
    token: token,
  });
}

module.exports.verify = verify;
