const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "User_Data";
const amazonSes = new AWS.SES.DocumentClient();

async function mail(requestBody) {
  const username = requestBody.username;
  const token = requestBody.token;
  const to = requestBody.to;
  const body = requestBody.body;
  if (!username || !token || !to || !body) {
    return util.buildResponse(401, {
      message: "Missing fields!",
    });
  }
  const dynamoUser = await getUser(username);
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, {
      message: "user does not exist",
    });
  }
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, {
      message: "password is incorrect",
    });
  }

  const sendMailResponse = await sendMail(user);
  if (!sendMailResponse) {
    return util.buildResponse(503, {
      message: "Server error.",
    });
  }

  return util.buildResponse(200, response);
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        console.log("Response received!", response.Item);
        return response.Item;
      },
      (error) => {
        console.error("There is an error: ", error);
      }
    );
}

module.exports.mail = mail;
