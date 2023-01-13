const util = require("../utils/util");
const auth = require("../utils/auth");
const bcrypt = require("bcryptjs");

const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});

const dynamodb = AWS.DynamoDB.DocumentClient();
const usertable = "User_Data";

async function login(userinfo) {
  const username = userinfo.username;
  const password = userinfo.password;

  //check if fields are empty
  if (!username || !password) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }

  //check if username exists
  const dynamoUser = await getUser(username);

  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(401, {
      message: "User does not exist",
    });
  }

  //check password
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, {
      message: "Password is incorrect",
    });
  }

  //user object creation
  const user = {
    username: dynamoUser.username,
    name: dynamoUser.name,
  };

  //token generation
  const token = auth.generateToken(userinfo);

  return util.buildResponse(200, {
    user: user,
    token: token,
  });
}

async function getUser(username) {
  const params = {
    TableName: usertable,
    Key: { username: username },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.item;
      },
      (error) => {
        console.log("There is an error in getting user: ", error);
      }
    );
}

module.exports.login = login;
