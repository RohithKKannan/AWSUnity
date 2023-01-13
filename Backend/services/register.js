const util = require("../utils/util");
const bcrypt = require("bcryptjs");

const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});

const dynamodb = AWS.DynamoDB.DocumentClient();
const usertable = "User_Data";

async function register(userinfo) {
  const name = userinfo.name;
  const email = userinfo.email;
  const username = userinfo.username;
  const password = userinfo.password;

  //check if any fields are empty
  if (!name || !email || !username || !password)
    return util.buildResponse(401, {
      message: "All fields are required",
    });

  //check if username already exists
  const dynamoUser = await getUser(username);

  if (dynamoUser && dynamoUser.username) {
    return util.buildResponse(401, {
      message: "Username already exists! Please try again",
    });
  }

  //encrypt password
  const encryptedpw = bcrypt.hashSync(password.trim());

  const user = {
    name: name,
    email: email,
    username: username.toLowerCase().trim(),
    password: encryptedpw,
  };

  const newDynamoUser = await saveUser(user);

  if (!newDynamoUser) {
    return util.buildResponse(503, {
      message: "Server error",
    });
  }

  return util.buildResponse(200, {
    message: "User has been registered",
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

async function saveUser(user) {
  const params = {
    TableName: usertable,
    Item: user,
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.item;
      },
      (error) => {
        console.log("There is an error in saving user: ", error);
      }
    );
}

module.exports.register = register;
