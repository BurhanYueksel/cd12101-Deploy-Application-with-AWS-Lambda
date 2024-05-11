import { v4 as uuid } from 'uuid';
import { getUserId } from '../auth/utils.mjs';
import { createTodo } from '../dataLayer/todosAccess';
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  const { name, dueDate } = JSON.parse(event.body);
  const authorization = event.headers.Authorization 
  const userId = getUserId(authorization);
  const todoId = uuid();

  const newTodo = {
    todoId,
    userId,
    name,
    dueDate,
    createdAt: new Date().toISOString(),
    done: false
  };

  await dynamoDbDocument.put({
    TableName: todosTable,
    Item: newTodo
  })

  await createTodo(newTodo);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodo
    })
  };
}
