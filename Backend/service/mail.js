const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "User_Data";
const amazonSes = new AWS.SES({ region: "ap-south-1" });

async function mail(requestBody) {
  const to = requestBody.to;
  const subject = requestBody.subject;
  const body = requestBody.body;
  const username = requestBody.username;
  if (!username || !to || !body) {
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
  const params = {
    Source: "hithu203@gmail.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };
  try {
    const result = await amazonSes.sendEmail(params).promise();
    console.log(result);
    return util.buildResponse(200, {
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return util.buildResponse(500, {
      message: "Please enter verified email address",
    });
  }
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
