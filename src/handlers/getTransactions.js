import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTransactions(event, context) {
  let transactions;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.TRANSACTIONS_TABLE_NAME,
      })
      .promise();
    transactions = result.Items;
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
