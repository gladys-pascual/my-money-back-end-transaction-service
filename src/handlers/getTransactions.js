import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTransactions(event, context) {
  let transactions;

  const { email } = event.requestContext.authorizer;

  console.log(email);

  try {
    const result = await dynamodb
      .query({
        TableName: process.env.TRANSACTIONS_TABLE_NAME,
        IndexName: "user",
        KeyConditionExpression: "#user = :user",
        ExpressionAttributeValues: {
          ":user": email,
        },
        ExpressionAttributeNames: {
          "#user": "user",
        },
        ScanIndexForward: false, //false means newest to oldest
      })
      .promise();
    transactions = result.Items;
    console.log(transactions);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(transactions),
  };
}

export const handler = commonMiddleware(getTransactions);
