import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateTransaction(event, context) {
  const { id } = event.pathParameters;
  const { type, category, amount, date, username, notes } = event.body;

  console.log("type", type);
  console.log("category", category);
  console.log("amount", amount);
  console.log("date", date);
  console.log("username", username);
  console.log("notes", notes);
  console.log("id", id);

  const params = {
    TableName: process.env.TRANSACTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set #type = :type, #date = :date, #category = :category, #amount = :amount, #notes = :notes",
    ExpresionAttributeValues: {
      ":type": type,
      ":category": category,
      ":amount": amount,
      ":date": date,
      ":notes": notes,
    },
    ExpressionAttributeNames: {
      "#type": "type",
      "#date": "date",
      "#category": "category",
      "#amount": "amount",
      "#notes": "notes",
    },
    ReturnValues: "UPDATED_NEW",
  };

  let updatedTransaction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedTransaction = result.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedTransaction),
  };
}

export const handler = commonMiddleware(updateTransaction);
