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
  const username = requestBody.username;
  const token = requestBody.token;
  const score = requestBody.score;
  if (!username || !token || !score) {
    return util.buildResponse(401, {
      message: "Invalid input for request",
    });
  }
  const verification = auth.verifyToken(username, token);
  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const updateResponse = await setScore(username, score);
  if (!updateResponse) {
    return util.buildResponse(403, {
      message: "There is no update from user",
    });
  }

  return util.buildResponse(200, {
    message: "update success",
    username: updateResponse.username,
  });
}

async function setScore(username, score) {
  console.log("Key Username : ", username);
  console.log("New Score : ", score);
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
    UpdateExpression: "SET #S = :y",
    ExpressionAttributeNames: {
      "#S": "score",
    },
    ExpressionAttributeValues: {
      ":y": score,
    },
  };
  return await dynamodb
    .update(params)
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
