import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export async function getAllTodos(userId: string) {
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    .promise();

  return result.Items;
}

export async function createTodo(todo) {
  await docClient
    .put({
      TableName: todosTable,
      Item: todo,
    })
    .promise();
}

export async function updateTodo(todoId: string, userId: string, updatedTodo) {
  await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done,
      },
      ExpressionAttributeNames: {
        '#name': 'name',
      },
    })
    .promise();
}

export async function deleteTodo(todoId: string, userId: string) {
  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    })
    .promise();
}