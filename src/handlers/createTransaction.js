import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createTransaction(event, context) {
  const { type, category, amount, date, username, notes } = event.body;

  const transaction = {
    id: uuid(),
    type,
    category,
    amount,
    date,
    username,
    notes,
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.TRANSACTIONS_TABLE_NAME,
        Item: transaction,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(transaction),
  };
}

export const handler = commonMiddleware(createTransaction);
