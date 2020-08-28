import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteTransaction(event, context) {
  const { id } = event.pathParameters;

  const params = {
    TableName: process.env.TRANSACTIONS_TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamodb.delete(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
  };
}

export const handler = commonMiddleware(deleteTransaction);
