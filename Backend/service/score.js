const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "User_Data";

async function score(user) {
  const username = user.username;
  const token = user.token;
  if (!username || !token) {
    return util.buildResponse(401, {
      message: "username and token required",
    });
  }
  const verification = auth.verifyToken(username, token);
  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }
  const dynamoUser = await getUser(username);
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, {
      message: "user does not exist",
    });
  }
  return util.buildResponse(200, {
    message: "Got score",
    score: dynamoUser.score,
  });
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

module.exports.score = score;
