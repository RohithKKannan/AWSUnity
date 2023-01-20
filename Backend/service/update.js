const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");
const auth = require("../utils/auth");
const bcrypt = require("bcryptjs");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "User_Data";

async function update(requestBody) {
  const username = requestBody.user.username;
  const token = requestBody.token;
  const score = requestBody.user.score;
  if (!username || !token) {
    return util.buildResponse(401, {
      message: "Invalid input for request",
    });
  }
  const verification = auth.verifyToken(username, token);
  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const updateResponse = setScore(username, score);
  if (!updateResponse) {
    return util.buildResponse(403, {
      message: "There is no update from user",
    });
  }

  return util.buildResponse(200, {
    message: "update success",
  });
}

async function setScore(username, score) {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
    UpdateExpression: "set #MyVariable = :y",
    ExpressionAttributeNames: {
      "#MyVariable": "score",
    },
    ExpressionAttributeValues: {
      ":y": score,
    },
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There is an error updating user: ", error);
      }
    );
}

module.exports.update = update;
