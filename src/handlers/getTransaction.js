import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTransaction(event, context) {
  let transaction;
  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.TRANSACTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    transaction = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!transaction) {
    throw new createError.NotFound(`Transaction with ID "${id}" not found.`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(transaction),
  };
}

export const handler = commonMiddleware(getTransaction);
