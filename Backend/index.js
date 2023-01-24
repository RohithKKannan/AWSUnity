const registerService = require("./service/register");
const loginService = require("./service/login");
const verifyService = require("./service/verify");
const updateService = require("./service/update");
const scoreService = require("./service/score");
const mailService = require("./service/mail");
const util = require("./utils/util");

const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";
const scorePath = "/score";
const updatePath = "/update";
const mailPath = "/sendmail";

exports.handler = async (event) => {
  console.log("Request Event : ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = util.buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === "POST" && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    case event.httpMethod === "POST" && event.path === verifyPath:
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
      break;
    case event.httpMethod === "PUT" && event.path === updatePath:
      const updateBody = JSON.parse(event.body);
      response = updateService.update(updateBody);
      break;
    case event.httpMethod === "POST" && event.path === scorePath:
      const scoreBody = JSON.parse(event.body);
      response = scoreService.score(scoreBody);
      break;
    case event.httpMethod === "POST" && event.path === mailPath:
      const emailBody = JSON.parse(event.body);
      response = mailService.mail(emailBody);
      break;
    default:
      response = util.buildResponse(404, "404 Not Found!");
  }
  return response;
};
