import { updateTodo } from '../dataLayer/todosAccess';

export async function handler(event) {
  const { todoId, userId, done } = JSON.parse(event.body);

  await updateTodo(todoId, userId, done);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: 'TODO updated successfully'
    })
  };
}