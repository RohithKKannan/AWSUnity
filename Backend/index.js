const util = require("./utils/util");

//Services
const registerService = require("./services/register");
const loginService = require("./services/login");
const verifyService = require("./services/verify");

//Paths
const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";

export const handler = async (event) => {
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      const registerBody = JSON.parse(event);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === "POST" && event.path === registerPath:
      response = util.buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === loginPath:
      response = util.buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === verifyPath:
      response = util.buildResponse(200);
      break;
    default:
      response = util.buildResponse(403, "403 Not Found");
  }
  return response;
};
