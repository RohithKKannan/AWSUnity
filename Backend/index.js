const registerService = require("./service/register");
const loginService = require("./service/login");
const verifyService = require("./service/verify");
const updateService = require("./service/update");
const scoreService = require("./service/score");
const util = require("./utils/util");

const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";
const scorePath = "/score";
const updatePath = "/update";

exports.handler = async (event) => {
  console.log("Request Event : ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      console.log("healthEvent");
      response = util.buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === registerPath:
      console.log("registerEvent");
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === "POST" && event.path === loginPath:
      console.log("loginEvent");
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    case event.httpMethod === "POST" && event.path === verifyPath:
      console.log("verifyEvent");
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
      break;
    case event.httpMethod === "PUT" && event.path === updatePath:
      console.log("updateEvent");
      const updateBody = JSON.parse(event.body);
      response = updateService.update(updateBody);
      break;
    case event.httpMethod === "POST" && event.path === scorePath:
      console.log("scoreEvent");
      const scoreBody = JSON.parse(event.body);
      response = scoreService.score(scoreBody);
      break;
    default:
      console.log("nullEvent");
      response = util.buildResponse(404, "404 Not Found!");
  }
  return response;
};
